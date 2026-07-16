import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

// ─── 1. DTO الخاص بتحديث حالة الحجز ─────────────────────────────────────────
export class UpdateBookingStatusDto {
  @IsEnum(
    [
      'PENDING',
      'CONFIRMED',
      'CHECKED_IN',
      'CHECKED_OUT',
      'CANCELLED',
      'NO_SHOW',
    ],
    {
      message:
        'الحالة المرسلة غير صحيحة، يجب أن تكون PENDING, CONFIRMED, CHECKED_IN, CHECKED_OUT, CANCELLED, أو NO_SHOW',
    },
  )
  status!:
    | 'PENDING'
    | 'CONFIRMED'
    | 'CHECKED_IN'
    | 'CHECKED_OUT'
    | 'CANCELLED'
    | 'NO_SHOW';
}

// ─── 2. DTO الخاص بالفيلتر والـ Pagination (البحث والصفحات) ──────────────────
export class BookingQueryDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsUUID('all', { message: 'معرف الغرفة يجب أن يكون UUID صحيح' })
  roomId?: string;

  @IsOptional()
  @IsUUID('all', { message: 'معرف العميل يجب أن يكون UUID صحيح' })
  customerId?: string;

  // الفيلتر الخاص بالتاريخ
  @IsOptional()
  @IsString()
  from?: string; // تاريخ البدء للبحث مثلاً 2026-01-01

  @IsOptional()
  @IsString()
  to?: string; // تاريخ النهاية للبحث

  // الـ Pagination (رقم الصفحة والعدد)
  @IsOptional()
  @Type(() => Number) // لتحويل النص القادم من الـ URL إلى رقم تلقائياً
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
