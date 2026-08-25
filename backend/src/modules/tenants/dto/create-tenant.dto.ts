import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterTenantDto {
  // 🏢 بيانات الـ Tenant (الفندق)
  @ApiProperty({
    example: 'Grand Cairo Hotel',
    description: 'اسم الفندق / المنشأة',
  })
  @IsString()
  @IsNotEmpty()
  tenantName!: string;

  // 👤 بيانات الـ Admin (المدير)
  @ApiProperty({
    example: 'Abdelrahman Yasser',
    description: 'اسم المدير المسؤول',
  })
  @IsString()
  @IsNotEmpty()
  adminName!: string;

  @ApiProperty({
    example: 'admin@cairohotel.com',
    description: 'البريد الإلكتروني للوجين',
  })
  @IsEmail()
  @IsNotEmpty()
  adminEmail!: string;

  @ApiProperty({
    example: 'P@ssword123',
    minLength: 8,
    description: 'كلمة السر',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  adminPassword!: string;
}
