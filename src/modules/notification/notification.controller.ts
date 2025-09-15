import { Controller, Get, Post, Body} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @Post()
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    this.notificationService.sendNotification(createNotificationDto);
  }
}