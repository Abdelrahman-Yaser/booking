import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; // 👈 استيراد مكتبة السواجر

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // تفعيل الـ ValidationPipe العالمي لو بتستخدمه
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // ─── 🛠️ إعدادات الـ SWAGGER ────────────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('Multi-Tenant Booking API')
    .setDescription('The Booking Platform API description')
    .setVersion('1.0')
    .addBearerAuth() // 👈 تفعيل خانة الـ Token لو عندك Auth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // 👈 هنا بنحدد المسار اللي هنفتح منه الصفحة (مثلاً: /api)
  SwaggerModule.setup('api', app, document);
  // ───────────────────────────────────────────────────────────────────────────

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Server is running on: http://localhost:${port}`);
  console.log(
    `📝 Swagger documentation available at: http://localhost:${port}/api`,
  );
}
bootstrap();
