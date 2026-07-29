import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';

export class CreatePaymentDto {
  @ApiProperty({ description: 'The booking ID to pay for' })
  @IsString()
  @IsNotEmpty()
  bookingId!: string;

  @ApiProperty({ enum: PaymentMethod, description: 'Payment method' })
  @IsEnum(PaymentMethod)
  method!: PaymentMethod;

  @ApiPropertyOptional({ description: 'Optional notes about the payment' })
  @IsString()
  @IsOptional()
  notes?: string;
}
