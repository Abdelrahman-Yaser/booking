import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { Room } from './entities/room.entity';
import { Booking } from '../bookings/entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Booking])], // <--- لازم تضيف Booking هنا كمان عشان دالة الفحص
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService], // <--- مهم جداً عشان الـ BookingsModule يقدر يشوفها!
})
export class RoomsModule {}