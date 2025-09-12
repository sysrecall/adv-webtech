// import { Injectable } from "@nestjs/common";
// import Pusher from "pusher";

// @Injectable()
// export class NotificationsService {
//   private pusher: Pusher;

//   constructor() {
//     const appId = process.env.PUSHER_APP_ID;
//     const key = process.env.PUSHER_KEY;
//     const secret = process.env.PUSHER_SECRET? " loaded" : " missing";
//     const cluster = process.env.PUSHER_CLUSTER;

//     if (!appId || !key || !secret || !cluster) {
//               console.error('Missing required Pusher environment variables');

//       throw new Error('Missing required Pusher environment variables');
      
//     }

//     this.pusher = new Pusher({
//       appId,
//       key,
//       secret,
//       cluster,
//       useTLS: true,
//     });
//         console.log("✅ Pusher Notifications Service Initialized");

//   }

//   async sendNotification(channel: string, event: string, data: any) {
//     await this.pusher.trigger(channel, event, data);
//   }
// }


import { Injectable } from '@nestjs/common';
import Pusher from 'pusher';

@Injectable()
export class NotificationsService {
  private pusher: Pusher;

  constructor() {
    // Solution 1: Using non-null assertion operator (!)
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