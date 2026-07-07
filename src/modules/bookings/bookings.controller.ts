import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/booking/create-booking.dto'; // تأكد من اسم ومسار ملف الـ DTO عندك
import { UpdateBookingDto } from './dto/booking/update-booking.dto';
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto, @Request() req: any) {
    // بناخد الـ tenantId والـ staffId من الـ user object اللي طالع من الـ Auth Guard
    const tenantId = req.user.tenantId;
    const staffId = req.user.id;
    return this.bookingsService.create(tenantId, staffId, createBookingDto);
  }

  @Get()
  findAll(@Query() query: any, @Request() req: any) {
    const tenantId = req.user.tenantId;
    return this.bookingsService.findAll(tenantId, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    const tenantId = req.user.tenantId;
    return this.bookingsService.findOne(tenantId, id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @Request() req: any,
  ) {
    const tenantId = req.user.tenantId;
    return this.bookingsService.update(tenantId, id, updateBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    const tenantId = req.user.tenantId;
    return this.bookingsService.remove(tenantId, id);
  }
}
