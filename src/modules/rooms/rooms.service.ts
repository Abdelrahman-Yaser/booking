import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Room } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Booking } from '../bookings/entities/booking.entity'; // تأكد من مسار الـ Booking entity

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>, // حقن ريبوزيتوري الغرف
    
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>, // حقن ريبوزيتوري الحجوزات لتشغيل دالة الفحص
  ) {}

  // ─── 1. CREATE ROOM ─────────────────────────────────────────────────────────
  async create(dto: CreateRoomDto): Promise<Room> {
    try {
      const newRoom = this.roomRepository.create({
        number: dto.number,
        type: dto.type,
        pricePerNight: dto.pricePerNight,
        capacity: dto.capacity,
        status: dto.status,
        tenantId: dto.tenantId, // ربط مباشر بالـ UUID الخاص بالفندق
      });

      return await this.roomRepository.save(newRoom);
    } catch (err) {
      if ((err as { code?: string }).code === '23505') {
        throw new ConflictException('Room number already exists in this hotel');
      }
      throw new InternalServerErrorException('Could not create room');
    }
  }

  // ─── 2. FIND ALL ROOMS ──────────────────────────────────────────────────────
  async findAll(tenantId?: string): Promise<Room[]> {
    const whereClause: any = { isDeleted: false };
    if (tenantId) whereClause.tenantId = tenantId; // فلترة الغرف حسب الفندق لو ممرر

    return await this.roomRepository.find({
      where: whereClause,
      relations: ['tenant'], // جلب بيانات الـ tenant (الفندق) المرتبط
      order: { createdAt: 'DESC' },
    });
  }

  // ─── 3. FIND ONE ROOM ───────────────────────────────────────────────────────
  async findOne(id: string): Promise<Room> {
    const room = await this.roomRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['tenant'],
    });

    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    return room;
  }

  // ─── 4. UPDATE ROOM ─────────────────────────────────────────────────────────
  async update(id: string, dto: UpdateRoomDto): Promise<Room> {
    const room = await this.findOne(id); // هيطلع 404 لو مش موجود
    
    this.roomRepository.merge(room, dto);
    return await this.roomRepository.save(room);
  }

  // ─── 5. REMOVE ROOM (SOFT DELETE) ──────────────────────────────────────────
  async remove(id: string): Promise<{ message: string }> {
    const room = await this.findOne(id);
    
    room.isDeleted = true; // تحويل الحقل لـ true لمحاكاة الحذف الآمن
    await this.roomRepository.save(room);
    
    return { message: `Room #${room.number} deleted successfully` };
  }

  // ─── 6. CHECK AVAILABILITY (الدالة الحرجة اللي مستنياها الـ Bookings) ───────
  async checkAvailability(
    tenantId: string,
    roomId: string,
    checkIn: Date,
    checkOut: Date,
    excludeBookingId?: string,
  ): Promise<boolean> {
    // بناء Query مخصص للبحث عن وجود أي تداخل في التواريخ لنفس الغرفة
    const query = this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.tenantId = :tenantId', { tenantId })
      .andWhere('booking.resourceId = :roomId', { roomId }) // resourceId يمثل الـ roomId بالـ Entity الموحد
      .andWhere('booking.status NOT IN (:...badStatuses)', { badStatuses: ['CANCELLED', 'NO_SHOW'] })
      .andWhere('booking.isDeleted = false')
      .andWhere(
        '(booking.startTime < :checkOut AND booking.endTime > :checkIn)',
        { checkIn, checkOut },
      );

    // لو بنعمل تعديل لحجز قائم، بنتجاهل الـ id بتاعه عشان ميعملش تداخل مع نفسه
    if (excludeBookingId) {
      query.andWhere('booking.id != :excludeBookingId', { excludeBookingId });
    }

    const conflictingBooking = await query.getOne();
    
    // لو لقى حجز متداخل يرجع false (الغرفة غير متاحة)، غير كدة يرجع true
    return !conflictingBooking;
  }
}