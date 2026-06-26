import {
  IsNotEmpty,
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateTenantDto {
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name is required' })
  @MinLength(3, { message: 'name must be at least 3 characters long' })
  @MaxLength(255, { message: 'name must not exceed 255 characters' })
  name!: string;

  @IsString({ message: 'timezone must be a string' })
  @IsOptional()
  timezone?: string;
}
