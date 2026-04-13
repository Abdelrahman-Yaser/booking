// // src/modules/rooms/entities/room.entity.ts
// // import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
// import { Tenant } from '../../tenants/entities/tenant.entity';

// // export enum RoomType   { SINGLE = 'SINGLE', DOUBLE = 'DOUBLE', SUITE = 'SUITE' }
// // export enum RoomStatus { AVAILABLE = 'AVAILABLE', OCCUPIED = 'OCCUPIED', MAINTENANCE = 'MAINTENANCE' }

// @Entity('rooms')
// export class Room {
//   @PrimaryGeneratedColumn('uuid')
//   id!: string;

//   @Column()
//   number!: string;

//   @Column({ type: 'enum', enum: RoomType })
//   type!: RoomType;

//   @Column('decimal', { precision: 10, scale: 2 })
//   pricePerNight!: number;

//   @Column({ default: 1 })
//   capacity!: number;

//   @Column({ type: 'enum', enum: RoomStatus, default: RoomStatus.AVAILABLE })
//   status!: RoomStatus;

//   @ManyToOne(() => Tenant, tenant => tenant.rooms)
//   tenant!: Tenant;          // multi-tenant: every room belongs to a tenant/hotel

//   @CreateDateColumn()
//   createdAt!: Date;
// }
