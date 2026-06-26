import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/auth.entity';

@Module({
  imports: [
    // 1. تسجيل الـ Repository الخاص بالـ User هنا في الـ imports الرئيسية للموديول
    TypeOrmModule.forFeature([User]),

    // 2. تسجيل الـ JwtModule بشكل منفصل ونظيف
    JwtModule.registerAsync({
      imports: [ConfigModule], // الـ JwtModule محتاج الـ ConfigModule بس عشان يقرأ الـ Secret
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' }, // يفضل تخليها قصيرة زي الـ Service (15 دقيقة) وتعتمد على الـ Refresh Token
      }),
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService, TypeOrmModule], // عملنا export للـ TypeOrm لو حبيت تستخدم الـ User في موديولات تانية (زي الـ Guards)
})
export class AuthModule {}
