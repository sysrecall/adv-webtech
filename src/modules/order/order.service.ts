import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from '../order-item/entities/order-item.entity';
import { Repository } from 'typeorm';
import { Customer } from '../customer/entities/customer.entity';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(Customer) private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const customer = await this.customerRepository.findOneBy({id: createOrderDto.customerId});
    if (!customer) throw new PreconditionFailedException("Invalid customer id");

    const orderItems = this.orderItemRepository.create(
      (createOrderDto.orderItems ?? []).map(item => ({
        ...item
      }))
    );

    const order = this.orderRepository.create({
      ...createOrderDto,
      orderTime: new Date().toUTCString(),
      customer,
      orderItems: orderItems,
    });

    return this.orderRepository.save(order);
  }

  async findAll() {
    return this.orderRepository.find();
  }

  async findOne(id: string) {
    return this.orderRepository.findOneBy({ id: id });
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    await this.orderRepository.update(id, updateOrderDto);
    return this.orderRepository.findBy({id: id});
  }

  async remove(id: string) {
    await this.orderRepository.delete(id);
  } 
}
