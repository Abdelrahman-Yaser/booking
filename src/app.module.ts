import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module'; // يفضل أن يكون Prisma في Module مستقل

@Module({
  imports: [
    // 1. إعداد الـ ConfigModule بشكل عالمي
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,

    // 3. استيراد الموديولات الأخرى
    AuthModule,
  ],
  controllers: [],
  providers: [], // الـ PrismaService سيكون داخل الـ PrismaModule
})
export class AppModule {}
