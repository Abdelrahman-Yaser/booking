// prisma.config.ts
import { defineConfig } from '@prisma/config';

export default defineConfig({
  // حددنا المسار بدقة لـ Prisma
  schema: 'src/prisma/schema.prisma',
  datasource: {
    // جرب كتابة الرابط مباشرة هنا للتأكد من تخطي مشكلة الـ Environment Variables مؤقتاً
    url: 'postgresql://postgres:0000@localhost:5432/booking?schema=public',
  },
});
