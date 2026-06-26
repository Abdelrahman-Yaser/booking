import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // بيحذف أي بيانت زيادة مبعوتة مش موجودة في الـ DTO
      forbidNonWhitelisted: true, // بيطلع خطأ لو حد بعت بيانات زيادة
      transform: true, // بيحول أنواع البيانات تلقائياً لو محتاجة تحويل
    }),
  );
  await app.listen(process.env.PORT ?? 9600);
}
bootstrap();
