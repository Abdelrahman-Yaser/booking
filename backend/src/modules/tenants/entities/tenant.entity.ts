import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import slugify from 'slugify';
import { User } from '../../auth/entities/auth.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { Room } from '../../rooms/entities/room.entity';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid') // <--- تعديل لـ uuid
  id!: string; // <--- تعديل لـ string

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  slug!: string;

  @Column({ type: 'varchar', length: 50, default: 'UTC' })
  timezone!: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;

  @OneToMany(() => User, (user) => user.tenant)
  users!: User[];

  @OneToMany(() => Room, (room) => room.tenant)
  rooms!: Room[];

  @OneToMany(() => Booking, (booking) => booking.tenant)
  bookings!: Booking[];

  @BeforeInsert()
  generateSlug() {
    if (this.name && !this.slug) {
      this.slug = slugify(this.name, {
        lower: true,
        strict: true,
        replacement: '-',
      });
    }
  }
}
