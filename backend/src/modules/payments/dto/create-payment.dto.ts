import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ description: 'The booking ID to pay for' })
  @IsString()
  @IsNotEmpty()
  bookingId!: string;

  @ApiProperty({ description: 'Payment method' })
  @IsEnum(['stripe', 'paypal', 'bank_transfer'], {
    message: 'method must be one of: stripe, paypal, bank_transfer',
  })
  method!: string;

  @ApiPropertyOptional({ description: 'Optional notes about the payment' })
  @IsString()
  @IsOptional()
  notes?: string;
}
