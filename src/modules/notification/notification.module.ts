import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';

@Module({
  controllers: [NotificationController],
  exports: [NotificationService],
  providers: [NotificationService],
})
export class NotificationModule {}
