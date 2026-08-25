import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import Stripe from 'stripe';

import { CreatePaymentDto } from './dto/create-payment.dto';
import {
  PaymentEntity,
  PaymentMethod,
  PaymentStatus,
} from './entities/payment.entity';
import { Booking } from '../bookings/entities/booking.entity'; // 👈 استيراد الـ Booking Entity الخاص بك
import { Room } from '../rooms/entities/room.entity';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly stripe: Stripe;

  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,

    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,

    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,

    private readonly dataSource: DataSource, // 💡 للتعامل مع الـ DB Transactions
    private readonly config: ConfigService,
  ) {
    // ✅ inject via ConfigService — never use process.env directly
    this.stripe = new Stripe(
      this.config.getOrThrow<string>('STRIPE_SECRET_KEY'),
    );
  }

  private calculateNights(checkIn: Date, checkOut: Date): number {
    const diff = checkOut.getTime() - checkIn.getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  private normalizePaymentMethod(method: string): PaymentMethod {
    const normalized = method.toUpperCase().replace('-', '_') as PaymentMethod;
    if (!Object.values(PaymentMethod).includes(normalized)) {
      throw new BadRequestException(`Unsupported payment method: ${method}`);
    }
    return normalized;
  }

  // ─── INITIATE PAYMENT (create PaymentIntent + save to DB) ────────────────────
  async initiatePayment(dto: CreatePaymentDto) {
    const booking = await this.bookingRepository.findOne({
      where: { id: dto.bookingId },
    });

    if (!booking) {
      throw new NotFoundException(`Booking #${dto.bookingId} not found`);
    }

    const existingPayment = await this.paymentRepository.findOne({
      where: { bookingId: dto.bookingId },
    });
    if (existingPayment) {
      throw new BadRequestException('This booking already has a payment');
    }

    const room = await this.roomRepository.findOne({
      where: { id: booking.resourceId, tenantId: booking.tenantId },
    });
    if (!room) {
      throw new NotFoundException('Room for this booking not found');
    }

    const nights = this.calculateNights(booking.startTime, booking.endTime);
    const amount = Number(room.pricePerNight) * nights;

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      metadata: { bookingId: booking.id },
      automatic_payment_methods: { enabled: true },
    });

    this.logger.log(`Created PaymentIntent: ${paymentIntent.id}`);

    const payment = this.paymentRepository.create({
      bookingId: dto.bookingId,
      amount,
      method: this.normalizePaymentMethod(dto.method),
      status: PaymentStatus.PENDING,
      stripePaymentId: paymentIntent.id,
      stripeClientSecret: paymentIntent.client_secret,
      notes: dto.notes,
    });

    const savedPayment = await this.paymentRepository.save(payment);

    return {
      paymentId: savedPayment.id,
      clientSecret: paymentIntent.client_secret,
      amount,
    };
  }

  // ─── FIND ALL (for current tenant) ───────────────────────────────────────────
  async findAll(tenantId: string) {
    return this.paymentRepository.find({
      where: { booking: { tenantId } },
      relations: ['booking'],
      order: { createdAt: 'DESC' },
    });
  }

  // ─── FIND ONE ─────────────────────────────────────────────────────────────────
  async findOne(id: string, tenantId: string) {
    const payment = await this.paymentRepository.findOne({
      where: { id, booking: { tenantId } },
      relations: ['booking'],
    });

    if (!payment) {
      throw new NotFoundException(`Payment #${id} not found`);
    }

    return payment;
  }

  // ─── REVENUE SUMMARY (admin/manager only) ────────────────────────────────────
  async getRevenue(tenantId: string) {
    const query = this.paymentRepository
      .createQueryBuilder('payment')
      .innerJoin('payment.booking', 'booking')
      .where('payment.status = :status', { status: PaymentStatus.PAID })
      .andWhere('booking.tenantId = :tenantId', { tenantId });

    const { totalRevenue, totalPayments } = await query
      .select('SUM(payment.amount)', 'totalRevenue')
      .addSelect('COUNT(payment.id)', 'totalPayments')
      .getRawOne();

    return {
      totalRevenue: Number(totalRevenue) || 0,
      totalPayments: Number(totalPayments) || 0,
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
    payment.status = PaymentStatus.REFUNDED;
    return this.paymentRepository.save(payment);
  }

  // ─── MARK AS PAID (called internally by webhook) ─────────────────────────────
  async markAsPaid(stripePaymentId: string) {
    const payment = await this.paymentRepository.findOne({
      where: { stripePaymentId },
    });

    if (!payment) {
      this.logger.warn(`No payment found for Stripe ID: ${stripePaymentId}`);
      return;
    }

    // 💡 استخدام الـ Transaction بأمان مع TypeORM QueryRunner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. update payment status
      payment.status = PaymentStatus.PAID;
      payment.paidAt = new Date();
      await queryRunner.manager.save(payment);

      // 2. update booking status
      await queryRunner.manager.update(Booking, payment.bookingId, {
        status: 'CONFIRMED',
      });

      await queryRunner.commitTransaction();
      this.logger.log(`Payment ${payment.id} marked as PAID`);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Transaction failed for payment ${payment.id}`, err);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // ─── MARK AS FAILED (called internally by webhook) ───────────────────────────
  async markAsFailed(stripePaymentId: string) {
    const payment = await this.paymentRepository.findOne({
      where: { stripePaymentId },
    });

    if (!payment) return;

    payment.status = PaymentStatus.FAILED;
    await this.paymentRepository.save(payment);

    this.logger.log(`Payment ${payment.id} marked as FAILED`);
  }
}
