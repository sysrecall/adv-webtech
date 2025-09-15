import { Injectable } from '@nestjs/common';
import PushNotifications from '@pusher/push-notifications-server';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  private beamsClient: PushNotifications;

  constructor() {
    this.beamsClient = new PushNotifications({
      instanceId: process.env.PUSHER_BEAMS_INSTANCE_ID!,
      secretKey: process.env.PUSHER_BEAMS_SECRET_KEY!,
    });
  }

  async sendNotification(createNotificationDto: CreateNotificationDto) {
    await this.beamsClient.publishToInterests([createNotificationDto.interest], {
      web: {
        notification: {
          title: createNotificationDto.title,
          body: createNotificationDto.body,
          deep_link: createNotificationDto.url,
        },
      },
    });
  }
}
