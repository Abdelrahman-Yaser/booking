import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { StripeWebhookController } from './webhook/stripe.webhook.controller';
import { StripeWebhookService } from './webhook/stripe.webhook.service';
import { PaymentListeners } from './listeners/payment.listeners';
import { PaymentEntity } from './entities/payment.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Room } from '../rooms/entities/room.entity';

@Module({
  imports: [
    ConfigModule, // for ConfigService in PaymentsService + StripeWebhookService
    TypeOrmModule.forFeature([PaymentEntity, Booking, Room]),

    EventEmitterModule.forRoot(),
    // for emitting events in PaymentsService + StripeWebhookService
  ],
  controllers: [
    PaymentsController, // POST /payments, GET /payments, etc.
    StripeWebhookController, // POST /webhooks/stripe
  ],
  providers: [
    PaymentsService, // business logic + Stripe PaymentIntent
    StripeWebhookService, // signature verify + event emit
    PaymentListeners, // reacts to payment.succeeded / failed / refunded
  ],
  exports: [PaymentsService], // export so BookingsModule can call markAsPaid if needed
})
export class PaymentsModule {}
