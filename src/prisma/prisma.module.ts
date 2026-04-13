// src/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // لكي لا تضطر لاستيراده في كل موديول يدوياً
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
