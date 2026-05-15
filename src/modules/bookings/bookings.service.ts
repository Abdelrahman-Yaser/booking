import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RoomsService } from '../rooms/rooms.service';
import { NotificationsService } from '../notifications/notifications.service';
import {
  CreateBookingDto,
  UpdateBookingDto,
  UpdateBookingStatusDto,
  BookingQueryDto,
} from './dto/booking.dto';
import { BookingStatus, RoomStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private roomsService: RoomsService,
    private notifications: NotificationsService,
  ) {}

  private calcNights(checkIn: Date, checkOut: Date): number {
    const diff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  async create(tenantId: string, staffId: string, dto: CreateBookingDto) {
    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);

    if (checkOut <= checkIn) {
      throw new BadRequestException('Check-out must be after check-in');
    }

    // Validate room & customer
    const room = await this.prisma.room.findFirst({
      where: { id: dto.roomId, tenantId, isDeleted: false },
    });
    if (!room) throw new NotFoundException('Room not found');

    if (room.status === RoomStatus.MAINTENANCE) {
      throw new BadRequestException('Room is under maintenance');
    }

    const customer = await this.prisma.customer.findFirst({
      where: { id: dto.customerId, tenantId, isDeleted: false },
    });
    if (!customer) throw new NotFoundException('Customer not found');

    // Check availability (no double booking)
    const isAvailable = await this.roomsService.checkAvailability(
      tenantId,
      dto.roomId,
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

    const booking = await this.prisma.booking.create({
      data: {
        tenantId,
        roomId: dto.roomId,
        customerId: dto.customerId,
        staffId,
        checkIn,
        checkOut,
        nights,
        totalPrice,
        status: BookingStatus.CONFIRMED,
        notes: dto.notes,
        source: dto.source,
      },
      include: {
        room: { select: { number: true, type: true, pricePerNight: true } },
        customer: { select: { name: true, email: true, phone: true } },
        payment: true,
      },
    });

    // ── Send confirmation email (non-blocking) ───────────────────
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { name: true },
    });

    this.notifications.sendBookingConfirmation({
      customerName: booking.customer.name,
      customerEmail: booking.customer.email,
      hotelName: tenant?.name ?? 'Our Hotel',
      bookingId: booking.id,
      roomNumber: booking.room.number,
      roomType: booking.room.type,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      nights: booking.nights,
      totalPrice: Number(booking.totalPrice),
    }).catch(() => {}); // fire-and-forget — never block the response

    return booking;
  }

  async findAll(tenantId: string, query: BookingQueryDto) {
    const { status, roomId, customerId, from, to, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = { tenantId, isDeleted: false };
    if (status) where.status = status;
    if (roomId) where.roomId = roomId;
    if (customerId) where.customerId = customerId;
    if (from || to) {
      where.checkIn = {};
      if (from) where.checkIn.gte = new Date(from);
      if (to) where.checkIn.lte = new Date(to);
    }

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          room: { select: { number: true, type: true } },
          customer: { select: { name: true, email: true, phone: true } },
          payment: { select: { status: true, method: true, amount: true } },
        },
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      data: bookings,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(tenantId: string, id: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { id, tenantId, isDeleted: false },
      include: {
        room: true,
        customer: true,
        payment: true,
      },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    return booking;
  }

  async update(tenantId: string, id: string, dto: UpdateBookingDto) {
    const booking = await this.prisma.booking.findFirst({
      where: { id, tenantId, isDeleted: false },
      include: { room: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    if (
      booking.status === BookingStatus.CANCELLED ||
      booking.status === BookingStatus.CHECKED_OUT
    ) {
      throw new BadRequestException('Cannot update a cancelled or completed booking');
    }

    const checkIn = dto.checkIn ? new Date(dto.checkIn) : booking.checkIn;
    const checkOut = dto.checkOut ? new Date(dto.checkOut) : booking.checkOut;

    if (checkOut <= checkIn) {
      throw new BadRequestException('Check-out must be after check-in');
    }

    if (dto.checkIn || dto.checkOut) {
      const isAvailable = await this.roomsService.checkAvailability(
        tenantId,
        booking.roomId,
        checkIn,
        checkOut,
        id,
      );
      if (!isAvailable) {
        throw new ConflictException('Room is not available for the new dates');
      }
    }

    const nights = this.calcNights(checkIn, checkOut);
    const totalPrice = Number(booking.room.pricePerNight) * nights;

    return this.prisma.booking.update({
      where: { id },
      data: { checkIn, checkOut, nights, totalPrice, notes: dto.notes },
      include: {
        room: { select: { number: true, type: true } },
        customer: { select: { name: true, email: true } },
      },
    });
  }

  async updateStatus(tenantId: string, id: string, dto: UpdateBookingStatusDto) {
    const booking = await this.prisma.booking.findFirst({
      where: { id, tenantId, isDeleted: false },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    // Validate transitions
    const allowed: Record<BookingStatus, BookingStatus[]> = {
      PENDING: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
      CONFIRMED: [BookingStatus.CHECKED_IN, BookingStatus.CANCELLED, BookingStatus.NO_SHOW],
      CHECKED_IN: [BookingStatus.CHECKED_OUT],
      CHECKED_OUT: [],
      CANCELLED: [],
      NO_SHOW: [],
    };

    if (!allowed[booking.status].includes(dto.status)) {
      throw new BadRequestException(
        `Cannot transition from ${booking.status} to ${dto.status}`,
      );
    }

    // Update room status on check-in/out
    if (dto.status === BookingStatus.CHECKED_IN) {
      await this.prisma.room.update({
        where: { id: booking.roomId },
        data: { status: RoomStatus.OCCUPIED },
      });
    } else if (
      dto.status === BookingStatus.CHECKED_OUT ||
      dto.status === BookingStatus.CANCELLED ||
      dto.status === BookingStatus.NO_SHOW
    ) {
      await this.prisma.room.update({
        where: { id: booking.roomId },
        data: { status: RoomStatus.AVAILABLE },
      });
    }

    const updated = await this.prisma.booking.update({
      where: { id },
      data: { status: dto.status },
      include: {
        room: { select: { number: true, type: true } },
        customer: { select: { name: true, email: true } },
        payment: true,
      },
    });

    // ── Send status emails (non-blocking) ───────────────────────
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { name: true },
    });

    const emailData = {
      customerName: updated.customer.name,
      customerEmail: updated.customer.email,
      hotelName: tenant?.name ?? 'Our Hotel',
      bookingId: updated.id,
      roomNumber: updated.room.number,
      roomType: updated.room.type,
      checkIn: updated.checkIn,
      checkOut: updated.checkOut,
      nights: updated.nights,
      totalPrice: Number(updated.totalPrice),
    };

    if (dto.status === BookingStatus.CHECKED_IN) {
      this.notifications.sendCheckInNotification(emailData).catch(() => {});
    } else if (dto.status === BookingStatus.CHECKED_OUT) {
      this.notifications.sendCheckOutNotification(emailData).catch(() => {});
    } else if (dto.status === BookingStatus.CANCELLED) {
      this.notifications.sendCancellationNotification(emailData).catch(() => {});
    }

    return updated;
  }

  async cancel(tenantId: string, id: string) {
    return this.updateStatus(tenantId, id, { status: BookingStatus.CANCELLED });
  }

  async remove(tenantId: string, id: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { id, tenantId, isDeleted: false },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    await this.prisma.booking.update({
      where: { id },
      data: { isDeleted: true },
    });

    return { message: 'Booking deleted successfully' };
  }

  // CQRS-style read: summary stats
  async getSummary(tenantId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [total, confirmed, checkedIn, todayCheckIns, todayCheckOuts, revenue] =
      await Promise.all([
        this.prisma.booking.count({ where: { tenantId, isDeleted: false } }),
        this.prisma.booking.count({ where: { tenantId, status: BookingStatus.CONFIRMED, isDeleted: false } }),
        this.prisma.booking.count({ where: { tenantId, status: BookingStatus.CHECKED_IN, isDeleted: false } }),
        this.prisma.booking.count({
          where: { tenantId, checkIn: { gte: today, lt: tomorrow }, isDeleted: false },
        }),
        this.prisma.booking.count({
          where: { tenantId, checkOut: { gte: today, lt: tomorrow }, isDeleted: false },
        }),
        this.prisma.payment.aggregate({
          where: { tenantId, status: 'PAID' },
          _sum: { amount: true },
        }),
      ]);

    return {
      total,
      confirmed,
      checkedIn,
      todayCheckIns,
      todayCheckOuts,
      totalRevenue: revenue._sum.amount ?? 0,
    };
  }
}
