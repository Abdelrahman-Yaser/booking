import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterTenantDto {
  // 🏢 بيانات الـ Tenant (الفندق)
  @ApiProperty({ example: 'Grand Cairo Hotel' })
  @IsString()
  @IsNotEmpty()
  tenantName!: string;

  // 👤 بيانات الـ Admin (المدير)
  @ApiProperty({ example: 'Abdelrahman Yasser' })
  @IsString()
  @IsNotEmpty()
  adminName!: string;

  @ApiProperty({ example: 'admin@cairohotel.com' })
  @IsEmail()
  @IsNotEmpty()
  adminEmail!: string;

  @ApiProperty({ example: 'P@ssword123', minLength: 8 })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  adminPassword!: string;
}