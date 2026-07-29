import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod, PaymentStatus } from '@prisma/client';
import {clolum}from 'typeorm';

export class PaymentEntity {
  @Column({ primary: true })
  id!: string;
  bookingId!: string;

  @ApiProperty()
  amount!: number;

  @ApiProperty({ enum: PaymentMethod })
  method!: PaymentMethod;

  @ApiProperty({ enum: PaymentStatus })
  status!: PaymentStatus;

  @ApiPropertyOptional()
  stripePaymentId?: string | null;

  @ApiPropertyOptional()
  stripeClientSecret?: string | null;

  @ApiPropertyOptional()
  paidAt?: Date | null;

  @ApiPropertyOptional()
  notes?: string | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
