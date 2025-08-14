import { Module } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CartItemController } from './cart-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '../cart/entities/cart.entity';
import { Art } from '../art/entities/art.entity';
import { CartItem } from './entities/cart-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Art, Cart, CartItem])
  ],
  controllers: [CartItemController],
  providers: [CartItemService],
  
})
export class CartItemModule {}
