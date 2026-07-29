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

export enum RoomType {
  SINGLE = 'SINGLE',
  DOUBLE = 'DOUBLE',
  SUITE = 'SUITE',
}

export enum RoomStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  MAINTENANCE = 'MAINTENANCE',
}

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50 })
  number!: string;

  @Column({ type: 'enum', enum: RoomType })
  type!: RoomType;

  @Column('decimal', { precision: 10, scale: 2 })
  pricePerNight!: number;

  @Column({ type: 'int', default: 1 })
  capacity!: number;

  @Column({ type: 'enum', enum: RoomStatus, default: RoomStatus.AVAILABLE })
  status!: RoomStatus;

  // معرف التينانت كـ string متوافق مع الـ UUID
  @Column({ type: 'uuid' })
  tenantId!: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.rooms, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenantId' })
  tenant!: Tenant;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

@Column({ type: 'boolean', default: false })
  isDeleted!: boolean;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
