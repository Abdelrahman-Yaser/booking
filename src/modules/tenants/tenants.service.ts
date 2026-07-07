import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { Tenant } from './entities/tenant.entity';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>, // حقن الـ Repository الخاص بالـ Tenant
  ) {}

  // ─── CREATE TENANT ──────────────────────────────────────────────────────────
  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    try {
      // بنعمل create للكائن (هنا الـ @BeforeInsert بتشتغل لوحدها وتولد الـ slug من الاسم)
      const newTenant = this.tenantRepository.create(createTenantDto);

      return await this.tenantRepository.save(newTenant);
    } catch (err) {
      // كود خطأ تكرار الـ Slug الفريد في PostgreSQL هو '23505'
      if ((err as { code?: string }).code === '23505') {
        throw new ConflictException(
          'A hotel/tenant with this name or slug already exists',
        );
      }
      throw new InternalServerErrorException('Could not create tenant');
    }
  }

  // ─── FIND ALL TENANTS ───────────────────────────────────────────────────────
  async findAll(): Promise<Tenant[]> {
    return await this.tenantRepository.find();
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
    const tenant = await this.findOne(id); // هيطلع 404 لو مش موجود

    // دمج البيانات الجديدة مع البيانات القديمة
    this.tenantRepository.merge(tenant, updateTenantDto);

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
    const tenant = await this.findOne(id); // هيطلع 404 لو مش موجود

    await this.tenantRepository.remove(tenant);

    return { message: `Tenant '${tenant.name}' deleted successfully` };
  }
}
