import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm'; // 👇 استيراد FindOptionsWhere لضمان الـ Types
import { Room } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Booking } from '../bookings/entities/booking.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
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
        tenantId: dto.tenantId,
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
    // ✨ التعديل هنا: تحديد النوع لتجنب استخدام any
    const whereClause: FindOptionsWhere<Room> = { isDeleted: false };
    if (tenantId) whereClause.tenantId = tenantId;

    return await this.roomRepository.find({
      where: whereClause,
      relations: ['tenant'],
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
    const room = await this.findOne(id);
    
    this.roomRepository.merge(room, dto);
    return await this.roomRepository.save(room);
  }

  // ─── 5. REMOVE ROOM (SOFT DELETE) ──────────────────────────────────────────
  async remove(id: string): Promise<{ message: string }> {
    const room = await this.findOne(id);
    
    room.isDeleted = true;
    await this.roomRepository.save(room);
    
    return { message: `Room #${room.number} deleted successfully` };
  }

  // ─── 6. CHECK AVAILABILITY ──────────────────────────────────────────────────
  async checkAvailability(
    tenantId: string,
    roomId: string,
    checkIn: Date,
    checkOut: Date,
    excludeBookingId?: string,
  ): Promise<boolean> {
    const query = this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.tenantId = :tenantId', { tenantId })
      .andWhere('booking.resourceId = :roomId', { roomId })
      .andWhere('booking.status NOT IN (:...badStatuses)', { badStatuses: ['CANCELLED', 'NO_SHOW'] })
      .andWhere('booking.isDeleted = false')
      .andWhere(
        '(booking.startTime < :checkOut AND booking.endTime > :checkIn)',
        { checkIn, checkOut },
      );

    if (excludeBookingId) {
      query.andWhere('booking.id != :excludeBookingId', { excludeBookingId });
    }

    const conflictingBooking = await query.getOne();
    
    return !conflictingBooking;
  }
}