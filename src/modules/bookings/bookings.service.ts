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
// import { Customer } from '../customers/entities/customer.entity'; // فك الكومنت عند توفر الـ Entity
// import { Payment } from '../payments/entities/payment.entity';
import { RoomsService } from '../rooms/rooms.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateBookingDto } from './dto/booking/create-booking.dto';
import { UpdateBookingDto } from './dto/booking/update-booking.dto'; // تأكد من اسم ومسار ملف الـ DTO عندك
import { BookingQueryDto } from './dto/booking/BookingQueryDto';
// تعريف الـ Statuses يدوياً كنصوص طالما تخلصنا من @prisma/client
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
    // @InjectRepository(Customer) private readonly customerRepository: Repository<Customer>,
    // @InjectRepository(Payment) private readonly paymentRepository: Repository<Payment>,

    private readonly roomsService: RoomsService,
    private readonly notifications: NotificationsService,
  ) {}

  private calcNights(checkIn: Date, checkOut: Date): number {
    const diff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  // ─── CREATE BOOKING ──────────────────────────────────────────────────────────
  async create(tenantId: string, staffId: string, dto: CreateBookingDto) {
    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);

    if (checkOut <= checkIn) {
      throw new BadRequestException('Check-out must be after check-in');
    }

    // التحقق من الغرفة
    const room = await this.roomRepository.findOne({
      where: { id: dto.roomId, tenantId, isDeleted: false as any }, // مرر الحقول حسب الـ Entity عندك
    });
    if (!room) throw new NotFoundException('Room not found');

    if (room.status === RoomStatus.MAINTENANCE) {
      throw new BadRequestException('Room is under maintenance');
    }

    // التحقق من العميل (مفترض وجود كاستمر ريبوزيتوري)
    // const customer = await this.customerRepository.findOne({ where: { id: dto.customerId, tenantId, isDeleted: false } });
    // if (!customer) throw new NotFoundException('Customer not found');

    // فحص الإتاحة لمنع الحجز المزدوج
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

    // إنشاء الحجز
    const newBooking = this.bookingRepository.create({
      tenantId,
      resourceId: dto.roomId, // الـ resourceId يمثل الـ roomId بناء على هيكل الـ Entity الموحد
      userId: dto.customerId, // الـ userId يمثل الـ customerId بناء على الـ Entity الموحد
      startTime: checkIn,
      endTime: checkOut,
      status: 'CONFIRMED',
      // أضف أي حقول إضافية لو متوفرة في الـ Entity (مثل notes, source)
    });

    const booking = await this.bookingRepository.save(newBooking);

    // جلب بيانات الفندق لإرسال الإيميل
    const tenant = await this.tenantRepository.findOne({
      where: { id: tenantId },
      select: ['name'],
    });

    // إرسال إيميل التأكيد (Non-blocking / Fire-and-forget)
    this.notifications
      .sendBookingConfirmation({
        customerName: 'Customer Name', // استبدله بـ customer.name الحقيقي عند ربط الـ Repository
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
      isDeleted: false as any,
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
      order: { createdAt: 'DESC' } as any,
      // relations: ['tenant'] // فك الكومنت لو حابب تجلب العلاقات كاملة
    });

    return {
      data: bookings,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ─── FIND ONE BOOKING ────────────────────────────────────────────────────────
  async findOne(tenantId: string, id: string) {
    const booking = await this.bookingRepository.findOne({
      where: { id, tenantId, isDeleted: false as any },
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

    const checkIn = dto.checkIn ? new Date(dto.checkIn) : booking.startTime;
    const checkOut = dto.checkOut ? new Date(dto.checkOut) : booking.endTime;

    if (checkOut <= checkIn) {
      throw new BadRequestException('Check-out must be after check-in');
    }

    if (dto.checkIn || dto.checkOut) {
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

    const nights = this.calcNights(checkIn, checkOut);
    const totalPrice = Number(room.pricePerNight) * nights;

    booking.startTime = checkIn;
    booking.endTime = checkOut;
    // تخصيص السعر والنوتس لو متوفرين بالـ Entity

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

    // جدار الحماية الخاص بالتنقل بين الحالات (Status Transitions)
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

    // تحديث حالة الغرفة تلقائياً بناءً على حركة العميل
    if (dto.status === 'CHECKED_IN') {
      room.status = RoomStatus.OCCUPIED;
      await this.roomRepository.save(room);
    } else if (['CHECKED_OUT', 'CANCELLED', 'NO_SHOW'].includes(dto.status)) {
      room.status = RoomStatus.AVAILABLE;
      await this.roomRepository.save(room);
    }

    booking.status = dto.status;
    const updated = await this.bookingRepository.save(booking);

    // إرسال إيميلات التحديثات
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
      totalPrice: 0, // احسب السعر الإجمالي الكلي
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

    // Soft delete محاكي مثل كود بريزما القديم
    (booking as any).isDeleted = true;
    await this.bookingRepository.save(booking);

    return { message: 'Booking deleted successfully' };
  }

  // ─── GET SUMMARY STATS (CQRS-Style Read via QueryBuilder) ───────────────────
  async getSummary(tenantId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // حساب الـ Counts باستخدام دالة count العادية من ريبوزيتوري TypeORM
    const total = await this.bookingRepository.count({
      where: { tenantId, isDeleted: false as any },
    });
    const confirmed = await this.bookingRepository.count({
      where: { tenantId, status: 'CONFIRMED', isDeleted: false as any },
    });
    const checkedIn = await this.bookingRepository.count({
      where: { tenantId, status: 'CHECKED_IN', isDeleted: false as any },
    });

    const todayCheckIns = await this.bookingRepository.count({
      where: {
        tenantId,
        startTime: Between(today, tomorrow),
        isDeleted: false as any,
      },
    });

    const todayCheckOuts = await this.bookingRepository.count({
      where: {
        tenantId,
        endTime: Between(today, tomorrow),
        isDeleted: false as any,
      },
    });

    // لحساب إجمالي الإيرادات (Aggregate Sum) نستخدم الـ QueryBuilder
    // ملحوظة: يفترض وجود جدول للدفعات Payments مضاف له ريبوزيتوري هنا
    const revenueResult = { sum: 0 };
    /* const revenueResult = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'sum')
      .where('payment.tenantId = :tenantId AND payment.status = :status', { tenantId, status: 'PAID' })
      .getRawOne();
    */

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
