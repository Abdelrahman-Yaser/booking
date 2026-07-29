import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentEntity } from '../entities/payment.entity';
import { PaymentsService } from '../payments.service';

// ─── event payload types ──────────────────────────────────────────────────────
export interface PaymentSucceededPayload {
  stripePaymentId: string;
  bookingId: string;
  amount: number;
  currency: string;
}

export interface PaymentFailedPayload {
  stripePaymentId: string;
  bookingId: string;
  reason: string;
}

export interface PaymentRefundedPayload {
  chargeId: string;
  amount: number;
  refundedAmount: number;
}

@Injectable()
export class PaymentListeners {
  private readonly logger = new Logger(PaymentListeners.name);

  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    private readonly paymentsService: PaymentsService,
  ) {}

  // ─── PAYMENT SUCCEEDED ───────────────────────────────────────────────────────
  @OnEvent('payment.succeeded', { async: true })
  async handlePaymentSucceeded(
    payload: PaymentSucceededPayload,
  ): Promise<void> {
    this.logger.log(
      `💰 Handling payment.succeeded: ${payload.stripePaymentId}`,
    );

    try {
      // Delegates to PaymentsService which handles the DB transaction
      await this.paymentsService.markAsPaid(payload.stripePaymentId);

      // Load payment with booking & relations in TypeORM syntax
      const payment = await this.paymentRepository.findOne({
        where: { stripePaymentId: payload.stripePaymentId },
        relations: {
          booking: {
            customer: true,
            room: true,
            tenant: true,
          },
        },
      });

      if (!payment) return;

      // TODO: inject NotificationsService here once created
      // await this.notifications.sendReceiptEmail({
      //   customerEmail: payment.booking.customer.email,
      //   bookingId:     payment.booking.id,
      //   amount:        payload.amount,
      //   hotelName:     payment.booking.tenant.name,
      // });

      this.logger.log(
        `✅ Booking #${payment.bookingId} confirmed after payment`,
      );
    } catch (err: unknown) {
      this.logger.error(
        `❌ Failed to handle payment.succeeded for ${payload.stripePaymentId}`,
        err,
      );
      // TODO: push to dead-letter queue (SQS / Redis BullMQ) for retry
    }
  }

  // ─── PAYMENT FAILED ──────────────────────────────────────────────────────────
  @OnEvent('payment.failed', { async: true })
  async handlePaymentFailed(payload: PaymentFailedPayload): Promise<void> {
    this.logger.warn(
      `❌ Handling payment.failed: ${payload.stripePaymentId} — ${payload.reason}`,
    );

    try {
      await this.paymentsService.markAsFailed(payload.stripePaymentId);

      // TODO: notify customer that payment failed
      // await this.notifications.sendPaymentFailedEmail({ ... });
    } catch (err: unknown) {
      this.logger.error(
        `Failed to handle payment.failed for ${payload.stripePaymentId}`,
        err,
      );
    }
  }
  // ─── PAYMENT REFUNDED ────────────────────────────────────────────────────────
  @OnEvent('payment.refunded', { async: true })
  async handlePaymentRefunded(payload: PaymentRefundedPayload): Promise<void> {
    this.logger.log(
      `↩️  Handling payment.refunded: ${payload.chargeId} — $${payload.refundedAmount}`,
    );
    // refund status already updated in PaymentsService.refund()
    // TODO: send refund confirmation email to customer
  }
}
