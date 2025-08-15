import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderItem } from './entities/order-item.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Order } from '../order/entities/order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(Artist) private readonly artistRepository: Repository<Artist>,
    @InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>,
  ) {

  }
  async create(createOrderItemDto: CreateOrderItemDto) {
    const artist = await this.artistRepository.findOneBy({id: +createOrderItemDto.artistId});
    if (!artist) throw new PreconditionFailedException("Invalid artist id.");

    const {artistId, ..._orderItem} = createOrderItemDto;

    const orderItem = this.orderItemRepository.create({
      ..._orderItem,
      artist: artist,
    })
    return this.orderItemRepository.save(orderItem)
  }
  async findAll() {
    return this.orderItemRepository.find();
  }

  async findOne(id: string) {
    return this.orderItemRepository.findOneBy({ id: id });
  }

  async update(id: string, updateOrderItemDto: UpdateOrderItemDto) {
    await this.orderItemRepository.update(id, updateOrderItemDto);
    return this.orderItemRepository.findBy({id: id});
  }

  async remove(id: string) {
    await this.orderItemRepository.delete(id);
  } 
}
