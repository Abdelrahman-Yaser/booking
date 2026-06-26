import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Tenant } from '../../tenants/entities/tenant.entity';

@Entity('bookings') // يفضل الجمع لأسماء الجداول
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'uuid' })
  resourceId!: string;

  @Column({ type: 'uuid' })
  tenantId!: string;

  @Column({ type: 'timestamp' })
  startTime!: Date;

  @Column({ type: 'timestamp' })
  endTime!: Date;

  @Column({ type: 'varchar', length: 50, default: 'pending' }) // تعديل النوع إلى varchar
  status!: string;

  // تعديل الـ العلاقة لتشير إلى bookings بالجمع
  @ManyToOne(() => Tenant, (tenant: Tenant) => tenant.bookings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tenantId' }) // عشان يفهم إن العمود tenantId هو المفتاح الخارجي
  tenant!: Tenant;

  @CreateDateColumn({ type: 'timestamp' }) // توليد تلقائي لوقت إنشاء الحجز
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' }) // تحديث تلقائي لوقت تعديل الحجز
  updatedAt!: Date;
}
