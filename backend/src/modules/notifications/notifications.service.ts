import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '../MailerService/mailer.service';
import {
  bookingConfirmationTemplate,
  checkInTemplate,
  checkOutTemplate,
  cancellationTemplate,
} from './templates/booking.templates';

export interface BookingEmailData {
  customerName: string;
  customerEmail: string;
  hotelName: string;
  bookingId: string;
  roomNumber: string;
  roomType: string;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  totalPrice: number;
  currency?: string;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private mailer: MailerService) {}

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  // ── Called after booking is created ────────────────────────────
  async sendBookingConfirmation(data: BookingEmailData): Promise<void> {
    const template = bookingConfirmationTemplate({
      customerName: data.customerName,
      hotelName: data.hotelName,
      bookingId: data.bookingId,
      roomNumber: data.roomNumber,
      roomType: data.roomType,
      checkIn: this.formatDate(data.checkIn),
      checkOut: this.formatDate(data.checkOut),
      nights: data.nights,
      totalPrice: data.totalPrice,
      currency: data.currency,
    });

    await this.mailer.send({
      to: data.customerEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    this.logger.log(`📧 Confirmation sent → ${data.customerEmail} [Booking: ${data.bookingId}]`);
  }

  // ── Called when status → CHECKED_IN ────────────────────────────
  async sendCheckInNotification(data: BookingEmailData): Promise<void> {
    const template = checkInTemplate({
      customerName: data.customerName,
      hotelName: data.hotelName,
      bookingId: data.bookingId,
      roomNumber: data.roomNumber,
      roomType: data.roomType,
      checkOut: this.formatDate(data.checkOut),
    });

    await this.mailer.send({
      to: data.customerEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    this.logger.log(`📧 Check-in email sent → ${data.customerEmail}`);
  }

  // ── Called when status → CHECKED_OUT ───────────────────────────
  async sendCheckOutNotification(data: BookingEmailData): Promise<void> {
    const template = checkOutTemplate({
      customerName: data.customerName,
      hotelName: data.hotelName,
      bookingId: data.bookingId,
      roomNumber: data.roomNumber,
      nights: data.nights,
      totalPrice: data.totalPrice,
      currency: data.currency,
    });

    await this.mailer.send({
      to: data.customerEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    this.logger.log(`📧 Check-out email sent → ${data.customerEmail}`);
  }

  // ── Called when status → CANCELLED ─────────────────────────────
  async sendCancellationNotification(data: BookingEmailData): Promise<void> {
    const template = cancellationTemplate({
      customerName: data.customerName,
      hotelName: data.hotelName,
      bookingId: data.bookingId,
      roomNumber: data.roomNumber,
      checkIn: this.formatDate(data.checkIn),
      checkOut: this.formatDate(data.checkOut),
    });

    await this.mailer.send({
      to: data.customerEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    this.logger.log(`📧 Cancellation email sent → ${data.customerEmail}`);
  }
}
