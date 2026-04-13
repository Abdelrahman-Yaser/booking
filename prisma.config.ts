// prisma.config.ts
import 'dotenv/config';
import { defineConfig, env } from '@prisma/config';

export default defineConfig({
  // حددنا المسار بدقة لـ Prisma
  schema: 'src/prisma/schema.prisma',
  datasource: {
    // جرب كتابة الرابط مباشرة هنا للتأكد من تخطي مشكلة الـ Environment Variables مؤقتاً
    url: env('DATABASE_URL'),
  },
});
