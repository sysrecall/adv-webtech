import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Art } from '../art/entities/art.entity';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Cart } from '../cart/entities/cart.entity';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(Art) private readonly artRepository: Repository<Art>,
    @InjectRepository(CartItem) private readonly cartItemRepository: Repository<CartItem>,
  ) {}
  async create(createCartItemDto: CreateCartItemDto) {
    const art = await this.artRepository.findOneBy({id: createCartItemDto.artId});
    if (!art) throw new PreconditionFailedException("Invalid art id.");

    const {artId, ..._cartItem} = createCartItemDto;

    const cartItem = this.cartItemRepository.create({
      ..._cartItem,
      art,
    })

    return this.cartItemRepository.save(cartItem);
  }

  async findAll() {
    return this.cartItemRepository.find();
  }

  async findOne(id: string) {
    return this.cartItemRepository.findOneBy({id: id});
  }

  async update(id: string, updateCartItemDto: UpdateCartItemDto) {
    await this.cartItemRepository.update(id, updateCartItemDto);
    return this.cartItemRepository.findBy({id: id});
  }

  async remove(id: string) {
    return this.cartItemRepository.delete(id);
  }
}
