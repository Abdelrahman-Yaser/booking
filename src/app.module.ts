import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
// import { AuthModule } from './auth/auth.module';
import { TenantsModule } from './modules/tenants/tenants.module';
// import { RoomsModule } from './rooms/rooms.module';
// import { CustomersModule } from './customers/customers.module';
// import { BookingsModule } from './modules/bookings/bookings.module';
// import { PaymentsModule } from './payments/payments.module';
// import { ReviewsModule } from './reviews/reviews.module';
// import { PrismaModule } from './prisma/prisma.module';
// import { TenantContextModule } from './tenant-context/tenant-context.module';
// import { AnalyticsModule } from './analytics/analytics.module';
// import { NotificationsModule } from './modules/notifications/notifications.module';

import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

@Module({
  imports: [
    // initialize the TypeORM module with PostgreSQL configuration "Abdoo Yaser"
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '0000',
      database: 'booking',
      autoLoadEntities: true, // Automatically registers entities inside modules
      synchronize: true, // Auto-creates database tables based on entities (dev only!)
    }),
    // BookingsModule,

    // TenantContextModule,
    // AuthModule,
    TenantsModule,
    // RoomsModule,
    // CustomersModule,
    // PaymentsModule,
    // ReviewsModule,
    // AnalyticsModule,
    // NotificationsModule,
  ],
})
export class AppModule {}
