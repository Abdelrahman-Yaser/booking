import {
  IsString,
  IsOptional,
  IsUUID,
  IsDateString,
  IsIn,
} from 'class-validator';

export class CreateBookingDto {
  // 1. المعرفات الخارجية (IDs) مرتبة تماماً مثل الـ Entity
  @IsUUID('all', { message: 'معرف المستخدم يجب أن يكون UUID صحيح' })
  @IsOptional()
  userId?: string;

  @IsUUID('all', { message: 'must be a valid UUID' })
  resourceId!: string;

  @IsUUID('all', { message: 'معرف الشركة (Tenant) يجب أن يكون UUID صحيح' })
  tenantId!: string; // القادم من جدول tenants

  // 2. تفاصيل وقت الحجز (Booking Times)
  @IsDateString({}, { message: 'the start time must be a valid date string' })
  startTime!: string;

  @IsDateString({}, { message: 'the end time must be a valid date string' })
  endTime!: string;

  // 3. حالة الحجز (Booking Status)
  @IsString({ message: 'الحالة يجب أن تكون نصاً' })
  @IsOptional()
  @IsIn(['pending', 'confirmed', 'cancelled'], { message: 'الحالة غير صحيحة' })
  status?: string;
}
