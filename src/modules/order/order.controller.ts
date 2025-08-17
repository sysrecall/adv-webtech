import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { CustomerService } from '../customer/customer.service';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly mailerService: MailerService,
    private readonly customerService: CustomerService,
  ) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    const user = await this.customerService.findOne(createOrderDto.customerId);
    if (user) {
      this.mailerService.sendMail({
        to: user.email,
        subject: "Order Details",
        text: JSON.stringify(createOrderDto),
      })    
    }
    return await this.orderService.create(createOrderDto);
  }

  @Get()
  async findAll() {
    return await this.orderService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.orderService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return await this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.orderService.remove(id);
  }
}
