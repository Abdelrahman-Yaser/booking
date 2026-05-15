import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TenantsModule } from './tenants/tenants.module';
import { RoomsModule } from './rooms/rooms.module';
import { CustomersModule } from './customers/customers.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { ReviewsModule } from './reviews/reviews.module';
import { PrismaModule } from './prisma/prisma.module';
import { TenantContextModule } from './tenant-context/tenant-context.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { envValidationSchema } from './common/config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      validationOptions: {
        abortEarly: false, // show ALL missing vars at once
      },
    }),
    PrismaModule,
    TenantContextModule,
    AuthModule,
    TenantsModule,
    RoomsModule,
    CustomersModule,
    BookingsModule,
    PaymentsModule,
    ReviewsModule,
    AnalyticsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
