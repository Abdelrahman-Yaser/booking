import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaymentsService } from '../payments.service';

// ─── event payload types ──────────────────────────────────────────────────────
interface PaymentSucceededPayload {
  stripePaymentId: string;
  bookingId:       string;
  amount:          number;
  currency:        string;
}

interface PaymentFailedPayload {
  stripePaymentId: string;
  bookingId:       string;
  reason:          string;
}

interface PaymentRefundedPayload {
  chargeId:       string;
  amount:         number;
  refundedAmount: number;
}

@Injectable()
export class PaymentListeners {
  private readonly logger = new Logger(PaymentListeners.name);

  constructor(
    private readonly prisma: PrismaService,
    // ✅ only inject what actually exists in the module
    private readonly paymentsService: PaymentsService,
  ) {}

  // ─── PAYMENT SUCCEEDED ───────────────────────────────────────────────────────
  @OnEvent('payment.succeeded', { async: true })
  async handlePaymentSucceeded(payload: PaymentSucceededPayload) {
    this.logger.log(`💰 Handling payment.succeeded: ${payload.stripePaymentId}`);

    try {
      // delegates to PaymentsService which does the DB transaction
      await this.paymentsService.markAsPaid(payload.stripePaymentId);

      // load booking for notification
      const payment = await this.prisma.payment.findFirst({
        where: { stripePaymentId: payload.stripePaymentId },
        include: {
          booking: {
            include: {
              customer: true,
              room:     true,
              tenant:   true,
            },
          },
        },
      });

      if (!payment) return;

      // TODO: inject NotificationsService here once it's created
      // await this.notifications.sendReceiptEmail({
      //   customerEmail: payment.booking.customer.email,
      //   bookingId:     payment.booking.id,
      //   amount:        payload.amount,
      //   hotelName:     payment.booking.tenant.name,
      // });

      this.logger.log(
        `✅ Booking #${payment.bookingId} confirmed after payment`,
      );
    } catch (err) {
      this.logger.error(
        `❌ Failed to handle payment.succeeded for ${payload.stripePaymentId}`,
        err,
      );
      // TODO: push to dead-letter queue (SQS / Redis BullMQ) for retry
    }
  }

  // ─── PAYMENT FAILED ──────────────────────────────────────────────────────────
  @OnEvent('payment.failed', { async: true })
  async handlePaymentFailed(payload: PaymentFailedPayload) {
    this.logger.warn(
      `❌ Handling payment.failed: ${payload.stripePaymentId} — ${payload.reason}`,
    );

    try {
      await this.paymentsService.markAsFailed(payload.stripePaymentId);

      // TODO: notify customer that payment failed
      // await this.notifications.sendPaymentFailedEmail({ ... });
    } catch (err) {
      this.logger.error(
        `Failed to handle payment.failed for ${payload.stripePaymentId}`,
        err,
      );
    }
  }

  // ─── PAYMENT REFUNDED ────────────────────────────────────────────────────────
  @OnEvent('payment.refunded', { async: true })
  async handlePaymentRefunded(payload: PaymentRefundedPayload) {
    this.logger.log(
      `↩️  Handling payment.refunded: ${payload.chargeId} — $${payload.refundedAmount}`,
    );
    // refund status already updated in PaymentsService.refund()
    // TODO: send refund confirmation email to customer
  }
}
