import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Booking } from '../../bookings/entities/booking.entity';

// 1. تعريف الـ Enums (مستقلة عن Prisma)
export enum PaymentMethod {
  CARD = 'CARD',
  CASH = 'CASH',
  FAWRY = 'FAWRY',
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

@Entity('payments') // 👈 اسم الجدول في قاعدة البيانات
export class PaymentEntity {
  @ApiProperty({ description: 'المعرف الفريد للدفع (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'معرف الحجز المرتبط' })
  @Column({ type: 'uuid' })
  @Index() // 💡 إضافة Index لتسريع عمليات الـ Query بناءً على الـ bookingId
  bookingId!: string;

  @ManyToOne(() => Booking, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookingId' })
  booking?: Booking;

  @ApiProperty({ description: 'المبلغ الإجمالي' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @ApiProperty({ enum: PaymentMethod, description: 'طريقة الدفع' })
  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CARD,
  })
  method!: PaymentMethod;

  @ApiProperty({ enum: PaymentStatus, description: 'حالة عملية الدفع' })
  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status!: PaymentStatus;

  @ApiPropertyOptional({ description: 'ID المعاملة في Stripe (pi_xxxx)' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  stripePaymentId?: string | null;

  @ApiPropertyOptional({ description: 'الـ Client Secret للفرونت إند' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  stripeClientSecret?: string | null;

  @ApiPropertyOptional({ description: 'تاريخ وساعة تمام عملية الدفع' })
  @Column({ type: 'timestamp', nullable: true })
  paidAt?: Date | null;

  @ApiPropertyOptional({ description: 'ملاحظات إضافية' })
  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
