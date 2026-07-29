import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RegisterTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { Tenant } from './entities/tenant.entity';
import { User } from '../auth/entities/auth.entity'; // استيراد الـ User entity

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>, // حقن الـ Repository الخاص بالـ Tenant
    private readonly dataSource: DataSource,
  ) {}

  // ─── CREATE TENANT ──────────────────────────────────────────────────────────
async registerTenant(dto: RegisterTenantDto) {
    // تشغيل الـ Transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1️⃣ إنشاء الـ Tenant وحفظه
      const tenant = queryRunner.manager.create(Tenant, {
        name: dto.tenantName,
      });
      const savedTenant = await queryRunner.manager.save(Tenant, tenant);

      // 2️⃣ تشفير كلمة مرور الـ Admin
      const hashedPassword = await bcrypt.hash(dto.adminPassword, 10);

      // 3️⃣ إنشاء الـ Admin وربطه بالـ Tenant الجديد
      const admin = queryRunner.manager.create(User, {
        name: dto.adminName,
        email: dto.adminEmail,
        password: hashedPassword,
        role: 'admin', 
        tenant: savedTenant, 
      });
      await queryRunner.manager.save(User, admin);

      // تأكيد المعاملة في قاعدة البيانات (Commit)
      await queryRunner.commitTransaction();

      return {
        message: 'Tenant and Admin registered successfully',
        tenantId: savedTenant.id,
        adminId: admin.id,
      };

    } catch (error) { // 👈 الـ catch بتفضل كدا من غير تايب مباشر
      // في حال حدوث أي خطأ، يتم التراجع عن كل شيء (Rollback)
      await queryRunner.rollbackTransaction();

      // 💡 التعديل السحري: طباعة الخطأ بالكامل عشان يظهرلك في الـ Terminal فوراً وتشوف المشكلة فين
      console.error('🔴 Registration Database Error Detailed:', error);

      // 💡 تحويل الـ error لـ Type محدد عشان تقرأ الـ message بتاعته بأمان
      const err = error as { message?: string };
      const errorMessage = err.message || 'Unknown database error';

      throw new BadRequestException('Registration failed: ' + errorMessage);
    } finally {
      // تحرير الـ Query Runner
      await queryRunner.release();
    }
  }
  

  // ─── FIND ALL TENANTS ───────────────────────────────────────────────────────
  async findAll(): Promise<Tenant[]> {
    return this.tenantRepository.find();
  }

  // ─── FIND ONE TENANT ────────────────────────────────────────────────────────
  async findOne(id: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({ where: { id } });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID #${id} not found`);
    }

    return tenant;
  }

  // ─── UPDATE TENANT ──────────────────────────────────────────────────────────
  async update(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    const tenant = await this.findOne(id); // will throw 404 if not found

    // merge new data into existing tenant
    this.tenantRepository.merge(tenant, updateTenantDto as DeepPartial<Tenant>);

    try {
      return await this.tenantRepository.save(tenant);
    } catch (err) {
      if ((err as { code?: string }).code === '23505') {
        throw new ConflictException(
          'A hotel/tenant with this name or slug already exists',
        );
      }
      throw new InternalServerErrorException('Could not update tenant');
    }
  }

  // ─── REMOVE TENANT ──────────────────────────────────────────────────────────
  async remove(id: string): Promise<{ message: string }> {
    const tenant = await this.findOne(id); // will throw 404 if not found

    await this.tenantRepository.remove(tenant);

    return { message: `Tenant '${tenant.name}' deleted successfully` };
  }
}
