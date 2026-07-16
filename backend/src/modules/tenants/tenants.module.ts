import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';
import { Tenant } from './entities/tenant.entity'; // 👈 تأكد من مسار الـ Tenant entity الصحيح عندك

@Module({
  imports: [
    // 👇 التعديل السحري: تسجيل الـ Repository هنا عشان السيرفس تقدر تحقنه
    TypeOrmModule.forFeature([Tenant]), 
  ],
  controllers: [TenantsController],
  providers: [TenantsService],
  exports: [TenantsService], // إضافته هنا لو بتحتاجه في موديولات تانية زي الـ Auth
})
export class TenantsModule {}