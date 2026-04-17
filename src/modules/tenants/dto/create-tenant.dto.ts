import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name!: string;

  @IsString()
  @IsNotEmpty()
  slug!: string; // أو ممكن تخلي السيرفر يولدها تلقائياً من الاسم
}
