import { Injectable } from '@nestjs/common';
import Pusher from 'pusher';

@Injectable()
export class NotificationsService {
  private pusher: Pusher;

  constructor() {
    this.pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.PUSHER_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: process.env.PUSHER_CLUSTER!,
      useTLS: true,
    });
  }

  async sendNotification(channel: string, event: string, data: any) {
    await this.pusher.trigger(channel, event, data);
  }
}