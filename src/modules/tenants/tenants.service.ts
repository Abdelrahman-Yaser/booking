import { Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Tenant } from '@prisma/client';

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    const slug = createTenantDto.slug
      .toLowerCase()
      .trim()
      .replaceAll(/\s+/g, '-');

    return this.prisma.tenant.create({
      data: {
        ...createTenantDto,
        slug: slug,
      },
    });
  }

  findAll(): Promise<Tenant[]> {
    return this.prisma.tenant.findMany();
  }

  // لاحظ الـ id بقى string
  findOne(id: string): Promise<Tenant | null> {
    return this.prisma.tenant.findUnique({ where: { id } });
  }

  update(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    return this.prisma.tenant.update({
      where: { id },
      data: updateTenantDto,
    });
  }

  remove(id: string): Promise<Tenant> {
    return this.prisma.tenant.delete({ where: { id } });
  }
}
