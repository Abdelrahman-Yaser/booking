import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // 1. إنشاء مجمع اتصالات (Pool) باستخدام الرابط من .env
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    // 2. إنشاء الـ Adapter
    const adapter = new PrismaPg(pool);

    // 3. تمرير الـ adapter لـ PrismaClient
    super({
      adapter,
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}