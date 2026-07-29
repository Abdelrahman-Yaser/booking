import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentStatus } from '@prisma/client';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly stripe: Stripe;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    // ✅ inject via ConfigService — never use process.env directly
    this.stripe = new Stripe(this.config.getOrThrow<string>('STRIPE_SECRET_KEY'));
  }

  // ─── INITIATE PAYMENT (create PaymentIntent + save to DB) ────────────────────
  async initiatePayment(dto: CreatePaymentDto) {
    // 1. confirm booking exists and is not already paid
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: { payment: true },
    });

    if (!booking) {
      throw new NotFoundException(`Booking #${dto.bookingId} not found`);
    }

    if (booking.payment) {
      throw new BadRequestException('This booking already has a payment');
    }

    // 2. create Stripe PaymentIntent
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(Number(booking.totalPrice) * 100), // cents
      currency: 'usd',
      metadata: { bookingId: booking.id },
      automatic_payment_methods: { enabled: true },
    });

    this.logger.log(`Created PaymentIntent: ${paymentIntent.id}`);

    // 3. save Payment record in DB with status PENDING
    const payment = await this.prisma.payment.create({
      data: {
        bookingId:          dto.bookingId,
        amount:             booking.totalPrice,
        method:             dto.method,
        status:             PaymentStatus.PENDING,
        stripePaymentId:    paymentIntent.id,
        stripeClientSecret: paymentIntent.client_secret,
        notes:              dto.notes,
      },
    });

    return {
      paymentId:    payment.id,
      clientSecret: paymentIntent.client_secret, // sent to frontend to complete payment
      amount:       booking.totalPrice,
    };
  }

  // ─── FIND ALL (for current tenant) ───────────────────────────────────────────
  async findAll(tenantId: string) {
    return this.prisma.payment.findMany({
      where: {
        booking: { tenantId },
      },
      include: {
        booking: {
          select: {
            id:       true,
            checkIn:  true,
            checkOut: true,
            customer: { select: { name: true, email: true } },
            room:     { select: { roomNumber: true, type: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── FIND ONE ─────────────────────────────────────────────────────────────────
  async findOne(id: string, tenantId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: {
        id,
        booking: { tenantId },
      },
      include: {
        booking: {
          include: {
            customer: true,
            room:     true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException(`Payment #${id} not found`);
    }

    return payment;
  }

  // ─── REVENUE SUMMARY (admin/manager only) ────────────────────────────────────
  async getRevenue(tenantId: string) {
    const result = await this.prisma.payment.aggregate({
      where: {
        status:  PaymentStatus.PAID,
        booking: { tenantId },
      },
      _sum:   { amount: true },
      _count: { id: true },
    });

    return {
      totalRevenue:  result._sum.amount ?? 0,
      totalPayments: result._count.id,
    };
  }

  // ─── REFUND ───────────────────────────────────────────────────────────────────
  async refund(id: string, tenantId: string) {
    const payment = await this.findOne(id, tenantId);

    if (payment.status !== PaymentStatus.PAID) {
      throw new BadRequestException('Only paid payments can be refunded');
    }

    if (!payment.stripePaymentId) {
      throw new BadRequestException('No Stripe payment ID associated');
    }

    // 1. issue refund on Stripe
    await this.stripe.refunds.create({
      payment_intent: payment.stripePaymentId,
    });

    this.logger.log(`Refund issued for payment ${payment.id}`);

    // 2. update DB — webhook will also fire but we update optimistically
    return this.prisma.payment.update({
      where: { id },
      data: { status: PaymentStatus.REFUNDED },
    });
  }

  // ─── MARK AS PAID (called internally by webhook) ─────────────────────────────
  async markAsPaid(stripePaymentId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { stripePaymentId },
    });

    if (!payment) {
      this.logger.warn(`No payment found for Stripe ID: ${stripePaymentId}`);
      return;
    }

    await this.prisma.$transaction([
      // update payment status
      this.prisma.payment.update({
        where: { id: payment.id },
        data:  { status: PaymentStatus.PAID, paidAt: new Date() },
      }),
      // update booking status
      this.prisma.booking.update({
        where: { id: payment.bookingId },
        data:  { status: 'CONFIRMED' },
      }),
    ]);

    this.logger.log(`Payment ${payment.id} marked as PAID`);
  }

  // ─── MARK AS FAILED (called internally by webhook) ───────────────────────────
  async markAsFailed(stripePaymentId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { stripePaymentId },
    });

    if (!payment) return;

    await this.prisma.payment.update({
      where: { id: payment.id },
      data:  { status: PaymentStatus.FAILED },
    });

    this.logger.log(`Payment ${payment.id} marked as FAILED`);
  }
}
