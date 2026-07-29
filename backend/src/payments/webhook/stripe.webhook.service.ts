import {
  Injectable,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import Stripe from 'stripe';

@Injectable()
export class StripeWebhookService {
  private readonly logger = new Logger(StripeWebhookService.name);
  private readonly stripe: Stripe;
  private readonly endpointSecret: string;

  constructor(
    // ✅ use ConfigService — not process.env directly
    private readonly config: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.stripe = new Stripe(
      this.config.getOrThrow<string>('STRIPE_SECRET_KEY'),
    );
    this.endpointSecret = this.config.getOrThrow<string>(
      'STRIPE_WEBHOOK_SECRET',
    );
  }

  async handleWebhook(rawBody: Buffer, sig: string): Promise<void> {
    let event: Stripe.Event;

    // ✅ CRITICAL: verify Stripe signature — rejects any forged request
    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        sig,
        this.endpointSecret,
      );
    } catch (err) {
      this.logger.error(`Webhook signature verification failed: ${err}`);
      throw new BadRequestException('Invalid webhook signature');
    }

    this.logger.log(`📨 Webhook received: ${event.type}`);

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSucceeded(
          event.data.object as Stripe.PaymentIntent,
        );
        break;

      case 'payment_intent.payment_failed':
        await this.handlePaymentFailed(
          event.data.object as Stripe.PaymentIntent,
        );
        break;

      case 'charge.refunded':
        await this.handleRefund(event.data.object as Stripe.Charge);
        break;

      default:
        this.logger.warn(`Unhandled webhook event: ${event.type}`);
    }
  }

  // ─── PRIVATE HANDLERS ────────────────────────────────────────────────────────

  private async handlePaymentSucceeded(pi: Stripe.PaymentIntent) {
    this.logger.log(`💰 Payment succeeded: ${pi.id}`);

    // emit internal event → PaymentListeners picks it up
    this.eventEmitter.emit('payment.succeeded', {
      stripePaymentId: pi.id,
      bookingId:       pi.metadata?.bookingId,
      amount:          pi.amount / 100,         // cents → dollars
      currency:        pi.currency,
    });
  }

  private async handlePaymentFailed(pi: Stripe.PaymentIntent) {
    this.logger.warn(`❌ Payment failed: ${pi.id}`);

    this.eventEmitter.emit('payment.failed', {
      stripePaymentId: pi.id,
      bookingId:       pi.metadata?.bookingId,
      reason:          pi.last_payment_error?.message ?? 'Unknown error',
    });
  }

  private async handleRefund(charge: Stripe.Charge) {
    this.logger.log(`↩️  Charge refunded: ${charge.id}`);

    this.eventEmitter.emit('payment.refunded', {
      chargeId:       charge.id,
      amount:         charge.amount / 100,
      refundedAmount: (charge.amount_refunded ?? 0) / 100,
    });
  }
}
