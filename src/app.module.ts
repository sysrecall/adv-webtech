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
      password: '123',
      database: 'art_store',
      autoLoadEntities: true,
      synchronize: true
  }),
    AuthModule, AdminModule, ArtistModule, CustomerModule,
    ArtModule, CartModule, OrderItemModule, OrderModule, CartItemModule,
],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
