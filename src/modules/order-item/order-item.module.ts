import { Module } from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { OrderItemController } from './order-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './entities/order-item.entity';
import { Order } from '../order/entities/order.entity';
import { Artist } from 'src/artist/entities/artist.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderItem, Order, Artist])
  ],
  controllers: [OrderItemController],
  providers: [OrderItemService],
})
export class OrderItemModule {}
