import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { ArtistModule } from './artist/artist.module';
import { CustomerModule } from './modules/customer/customer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { ArtModule } from './modules/art/art.module';
import { CartModule } from './modules/cart/cart.module';
import { OrderItemModule } from './modules/order-item/order-item.module';
import { OrderModule } from './modules/order/order.module';
import { CartItemModule } from './modules/cart-item/cart-item.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.local',
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: process.env.DB_PASS ?? '123',
      database: 'art_store',
      autoLoadEntities: true,
      synchronize: true
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT ?? '587'),
        ignoreTLS: false,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }

      }
    }),
    AuthModule, AdminModule, ArtistModule, CustomerModule,
    ArtModule, CartModule, OrderItemModule, OrderModule, CartItemModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../'),
      renderPath: 'uploads'
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }
