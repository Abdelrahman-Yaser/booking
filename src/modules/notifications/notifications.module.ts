import { Global, Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { NotificationsService } from './notifications.service';

@Global() // available everywhere without re-importing
@Module({
  providers: [MailerService, NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
