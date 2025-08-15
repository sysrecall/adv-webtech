import { Injectable, NotFoundException, PreconditionFailedException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { Customer } from '../customer/entities/customer.entity';
import { Art } from '../art/entities/art.entity';
import { CartItem } from '../cart-item/entities/cart-item.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Customer) private readonly customerRepository: Repository<Customer>,
    @InjectRepository(CartItem) private readonly cartItemRepository: Repository<CartItem>
  ) {}

  async create(createCartDto: CreateCartDto) {
    const customer = await this.customerRepository.findOneBy({ id: createCartDto.customerId });
    if (!customer) throw new PreconditionFailedException("Invalid customer id");
    
    const incomingItems = this.cartItemRepository.create(
      (createCartDto.cartItems ?? []).map(item => ({
        ...item,
        art: { id: item.artId },
      }))
    );

    let cart = await this.cartRepository.findOne({
      where: { customer: { id: customer.id } },
      relations: ['cartItems', 'cartItems.art'],
    });

    if (cart) {
      cart.cartItems = (cart.cartItems ?? []).concat(incomingItems);
    } else {
      cart = this.cartRepository.create({
        customer,
        cartItems: incomingItems,
      });
    }

    return this.cartRepository.save(cart);
  }

  async findAll() {
    return this.cartRepository.find();
  }

  async findOne(id: string) {
    return this.cartRepository.findOneBy({id: id});
  }

  async update(id: string, updateCartDto: UpdateCartDto) {
    await this.cartRepository.update(id, updateCartDto);
    return this.cartRepository.findBy({id: id});
  }

  async remove(id: string) {
    return this.cartRepository.delete(id);
  }
}
