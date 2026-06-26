import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import slugify from 'slugify'; // مكتبة ممتازة لتوليد الـ slugs (تحتاج تثبيتها: npm i slugify)
import { User } from '../../auth/entities/auth.entity'; // فك الكومنت لما تعمل الـ entities التانية
// import { Service } from '../../service.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('tenants') // تحديد اسم الجدول في قاعدة البيانات
export class Tenant {
  @PrimaryGeneratedColumn()
  id!: number;

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

  @OneToMany(() => Booking, (booking) => booking.tenant)
  bookings!: Booking[];

  // --- توليد الـ Slug تلقائياً قبل الحفظ في القاعدة ---
  @BeforeInsert()
  generateSlug() {
    if (this.name && !this.slug) {
      this.slug = slugify(this.name, {
        lower: true, // تحويل الحروف لـ lowercase
        strict: true, // إزالة الرموز الخاصة مثل @, #, $
        replacement: '-', // استبدال المسافات بشرطة
      });
    }
  }
}
