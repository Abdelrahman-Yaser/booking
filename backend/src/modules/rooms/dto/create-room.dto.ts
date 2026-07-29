import {
  IsNumber,
  IsString,
  IsEnum,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';
import { RoomStatus, RoomType } from '../entities/room.entity';

export class CreateRoomDto {
  @IsString()
  number!: string;

  @IsEnum(RoomType)
  type!: RoomType;

  @IsNumber({}, { message: 'السعر يجب أن يكون رقماً' })
  @Min(0, { message: 'السعر لا يمكن أن يكون أقل من صفر' })
  pricePerNight!: number;

  @IsNumber({}, { message: 'السعة الاستيعابية يجب أن تكون رقماً' })
  @Min(1, { message: 'السعة الاستيعابية يجب أن تكون شخص واحد على الأقل' })
  capacity!: number;

  @IsEnum(RoomStatus, { message: 'حالة الغرفة غير صحيحة' })
  @IsOptional() // اختياري لأن القيمة الافتراضية هي AVAILABLE
  status?: RoomStatus;

  @IsUUID('all', { message: 'معرف الفندق (Tenant) يجب أن يكون UUID صحيح' })
  tenantId!: string; // بنحتاجه عشان نربط الغرفة بالفندق فوراً عند الإنشاء
}
