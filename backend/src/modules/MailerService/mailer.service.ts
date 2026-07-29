import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private transporter: Transporter;

  constructor(private config: ConfigService) {
    this.transporter = this.createTransporter();
  }

  private createTransporter(): Transporter {
    const provider = this.config.get<string>('MAIL_PROVIDER') ?? 'smtp';

    if (provider === 'sendgrid') {
      return nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        auth: {
          user: 'apikey',
          pass: this.config.get<string>('SENDGRID_API_KEY'),
        },
      });
    }

    // Default: generic SMTP (Gmail, Mailtrap, Brevo, etc.)
    return nodemailer.createTransport({
      host: this.config.get<string>('MAIL_HOST') ?? 'smtp.mailtrap.io',
      port: this.config.get<number>('MAIL_PORT') ?? 587,
      secure: this.config.get<boolean>('MAIL_SECURE') ?? false,
      auth: {
        user: this.config.get<string>('MAIL_USER'),
        pass: this.config.get<string>('MAIL_PASS'),
      },
    });
  }

  async send(options: SendMailOptions): Promise<boolean> {
    const from = `"${this.config.get('MAIL_FROM_NAME') ?? 'Booking Platform'}" <${this.config.get('MAIL_FROM') ?? 'noreply@booking.com'}>`;

    try {
      const info = await this.transporter.sendMail({
        from,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      this.logger.log(`Email sent → ${options.to} | MsgId: ${info.messageId}`);
      return true;
    } catch (error) {
      // 💡 تحويل الـ error إلى any لتجنب مشكلة تفتيش TypeScript على حقل message
      this.logger.error(`Failed to send email to ${options.to}`, (error as any)?.message);
      return false;
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      this.logger.log('✅ Mail server connection verified');
      return true;
    } catch (error) {
      // 💡 تم تنظيف التداخل السطري بالكامل وعمل كاستنج صحيح للـ error
      this.logger.warn(`⚠️ Mail server not reachable: ${(error as any)?.message}`);
      return false;
    }
  }
}