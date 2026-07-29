import { PartialType } from '@nestjs/mapped-types';
import { RegisterTenantDto } from './create-tenant.dto';

export class UpdateTenantDto extends PartialType(RegisterTenantDto) {}
