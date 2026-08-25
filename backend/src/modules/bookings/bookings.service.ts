import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Between,
  LessThanOrEqual,
  MoreThanOrEqual,
  FindOptionsWhere,
} from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Room, RoomStatus } from '../rooms/entities/room.entity';
import { Tenant } from '../tenants/entities/tenant.entity';
import { RoomsService } from '../rooms/rooms.service';
import { NotificationsService } from '../notifications/notifications.service';

// إستيراد الـ DTOs الخاصة بك
import {
  CreateBookingDto,
  UpdateBookingStatusDto,
} from './dto/booking/create-booking.dto';
import { UpdateBookingDto } from './dto/booking/update-booking.dto';
import { BookingQueryDto } from './dto/booking/BookingQueryDto';

export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'CANCELLED'
  | 'NO_SHOW';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,

    private readonly roomsService: RoomsService,
    private readonly notifications: NotificationsService,
  ) {}

  private calcNights(checkIn: Date, checkOut: Date): number {
    const diff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  // ─── CREATE BOOKING ──────────────────────────────────────────────────────────
  async create(tenantId: string, staffId: string, dto: CreateBookingDto) {
    // 👇 تم التحديث لتقرأ startTime و endTime من الـ DTO بتاعك مباشرة
    const checkIn = new Date(dto.startTime);
    const checkOut = new Date(dto.endTime);

    if (checkOut <= checkIn) {
      throw new BadRequestException('Check-out must be after check-in');
    }

    // 👇 تم التحديث لتقرأ resourceId بدلاً من roomId القديمة
    const room = await this.roomRepository.findOne({
      where: { id: dto.resourceId, tenantId },
    });
    if (!room || (room as any).isDeleted)
      throw new NotFoundException('Room not found');

    if (room.status === RoomStatus.MAINTENANCE) {
      throw new BadRequestException('Room is under maintenance');
    }

    const isAvailable = await this.roomsService.checkAvailability(
      tenantId,
      dto.resourceId,
      checkIn,
      checkOut,
    );

    if (!isAvailable) {
      throw new ConflictException(
        'Room is not available for the selected dates',
      );
    }

    const nights = this.calcNights(checkIn, checkOut);
    const totalPrice = Number(room.pricePerNight) * nights;

    // 👇 التعديل السحري: حفظ البيانات بأسماء حقول الـ Entity والـ DTO المتناسقة تماماً
    const newBooking = this.bookingRepository.create({
      tenantId,
      resourceId: dto.resourceId,
      userId: dto.userId || staffId, // لو العميل مش ممرر بنعتبر السيرفس اتعملت بواسطة الـ staff
      startTime: checkIn,
      endTime: checkOut,
      status: 'CONFIRMED',
    });

    const booking = await this.bookingRepository.save(newBooking);

    const tenant = await this.tenantRepository.findOne({
      where: { id: tenantId },
      select: ['name'],
    });

    this.notifications
      .sendBookingConfirmation({
        customerName: 'Customer Name',
        customerEmail: 'customer@email.com',
        hotelName: tenant?.name ?? 'Our Hotel',
        bookingId: booking.id,
        roomNumber: room.number,
        roomType: room.type,
        checkIn: booking.startTime,
        checkOut: booking.endTime,
        nights: nights,
        totalPrice: totalPrice,
      })
      .catch(() => {});

    return booking;
  }

  // ─── FIND ALL BOOKINGS ───────────────────────────────────────────────────────
  async findAll(tenantId: string, query: BookingQueryDto) {
    const {
      status,
      roomId,
      customerId,
      from,
      to,
      page = 1,
      limit = 10,
    } = query;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Booking> = {
      tenantId,
      isDeleted: false,
    };
    if (status) where.status = status;
    if (roomId) where.resourceId = roomId;
    if (customerId) where.userId = customerId;

    if (from && to) {
      where.startTime = Between(new Date(from), new Date(to));
    } else if (from) {
      where.startTime = MoreThanOrEqual(new Date(from));
    } else if (to) {
      where.startTime = LessThanOrEqual(new Date(to));
    }

    const [bookings, total] = await this.bookingRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: bookings,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ─── FIND ONE BOOKING ────────────────────────────────────────────────────────
  async findOne(tenantId: string, id: string) {
    const booking = await this.bookingRepository.findOne({
      where: { id, tenantId, isDeleted: false },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    return booking;
  }

  // ─── UPDATE BOOKING ──────────────────────────────────────────────────────────
  async update(tenantId: string, id: string, dto: UpdateBookingDto) {
    const booking = await this.findOne(tenantId, id);
    const room = await this.roomRepository.findOne({
      where: { id: booking.resourceId },
    });
    if (!room) throw new NotFoundException('Room not found');

    if (booking.status === 'CANCELLED' || booking.status === 'CHECKED_OUT') {
      throw new BadRequestException(
        'Cannot update a cancelled or completed booking',
      );
    }

    // Update DTO uses startTime/endTime (consistent with create), fall back to existing booking times
    const checkIn = dto.startTime ? new Date(dto.startTime) : booking.startTime;
    const checkOut = dto.endTime ? new Date(dto.endTime) : booking.endTime;

    if (checkOut <= checkIn) {
      throw new BadRequestException('Check-out must be after check-in');
    }

    if (dto.startTime || dto.endTime) {
      const isAvailable = await this.roomsService.checkAvailability(
        tenantId,
        booking.resourceId,
        checkIn,
        checkOut,
        id,
      );
      if (!isAvailable) {
        throw new ConflictException('Room is not available for the new dates');
      }
    }

    booking.startTime = checkIn;
    booking.endTime = checkOut;

    return await this.bookingRepository.save(booking);
  }

  // ─── UPDATE STATUS ───────────────────────────────────────────────────────────
  async updateStatus(
    tenantId: string,
    id: string,
    dto: UpdateBookingStatusDto,
  ) {
    const booking = await this.findOne(tenantId, id);
    const room = await this.roomRepository.findOne({
      where: { id: booking.resourceId },
    });
    if (!room) throw new NotFoundException('Room not found');

    const allowed: Record<BookingStatus, string[]> = {
      PENDING: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['CHECKED_IN', 'CANCELLED', 'NO_SHOW'],
      CHECKED_IN: ['CHECKED_OUT'],
      CHECKED_OUT: [],
      CANCELLED: [],
      NO_SHOW: [],
    };

    if (!allowed[booking.status as BookingStatus].includes(dto.status)) {
      throw new BadRequestException(
        `Cannot transition from ${booking.status} to ${dto.status}`,
      );
    }

    if (dto.status === 'CHECKED_IN') {
      room.status = RoomStatus.OCCUPIED;
      await this.roomRepository.save(room);
    } else if (['CHECKED_OUT', 'CANCELLED', 'NO_SHOW'].includes(dto.status)) {
      room.status = RoomStatus.AVAILABLE;
      await this.roomRepository.save(room);
    }

    booking.status = dto.status;
    const updated = await this.bookingRepository.save(booking);

    const tenant = await this.tenantRepository.findOne({
      where: { id: tenantId },
      select: ['name'],
    });

    const emailData = {
      customerName: 'Customer Name',
      customerEmail: 'customer@email.com',
      hotelName: tenant?.name ?? 'Our Hotel',
      bookingId: updated.id,
      roomNumber: room.number,
      roomType: room.type,
      checkIn: updated.startTime,
      checkOut: updated.endTime,
      nights: this.calcNights(updated.startTime, updated.endTime),
      totalPrice: 0,
    };

    if (dto.status === 'CHECKED_IN')
      this.notifications.sendCheckInNotification(emailData).catch(() => {});
    if (dto.status === 'CHECKED_OUT')
      this.notifications.sendCheckOutNotification(emailData).catch(() => {});
    if (dto.status === 'CANCELLED')
      this.notifications
        .sendCancellationNotification(emailData)
        .catch(() => {});

    return updated;
  }

  async cancel(tenantId: string, id: string) {
    return this.updateStatus(tenantId, id, { status: 'CANCELLED' });
  }

  async remove(tenantId: string, id: string) {
    const booking = await this.findOne(tenantId, id);

    booking.isDeleted = true;
    await this.bookingRepository.save(booking);

    return { message: 'Booking deleted successfully' };
  }

  // ─── GET SUMMARY STATS ───────────────────────────────────────────────────────
  async getSummary(tenantId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const total = await this.bookingRepository.count({
      where: { tenantId, isDeleted: false },
    });
    const confirmed = await this.bookingRepository.count({
      where: { tenantId, status: 'CONFIRMED', isDeleted: false },
    });
    const checkedIn = await this.bookingRepository.count({
      where: { tenantId, status: 'CHECKED_IN', isDeleted: false },
    });

    const todayCheckIns = await this.bookingRepository.count({
      where: {
        tenantId,
        startTime: Between(today, tomorrow),
        isDeleted: false,
      },
    });

    const todayCheckOuts = await this.bookingRepository.count({
      where: { tenantId, endTime: Between(today, tomorrow), isDeleted: false },
    });

    const revenueResult = { sum: 0 };

    return {
      total,
      confirmed,
      checkedIn,
      todayCheckIns,
      todayCheckOuts,
      totalRevenue: Number(revenueResult?.sum || 0),
    };
  }
}
