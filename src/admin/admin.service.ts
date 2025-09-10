import { Injectable, BadRequestException, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, MoreThan, Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Customer } from 'src/modules/customer/entities/customer.entity';
import * as bcrypt from 'bcrypt';
import { Art } from 'src/modules/art/entities/art.entity';
import { Order } from 'src/modules/order/entities/order.entity';

@Injectable()
export class AdminService {
  artRepo: any;
  orderRepo: any;

  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Art)
     private readonly artRepository: Repository<Art>,
    @InjectRepository(Order)
     private readonly orderRepository: Repository<Order>
  ) {}


async create(createAdminDto: CreateAdminDto) {
  const { nidImage, password, ...rest } = createAdminDto;

  const salt = await bcrypt.genSalt(10);

  const passwordHash = await bcrypt.hash(password, salt);

  const admin = this.adminRepository.create({
    ...rest,
    password: passwordHash, // store hashed password
    nidImage: nidImage.buffer, // only pass the buffer for image
    status: createAdminDto.status || 'active',
  });

  return this.adminRepository.save(admin);
}

findAll() {
  return this.adminRepository.find({
    select: {
      id: true,
      fullName: true,
      age: true,
      status: true,
      username: true,
      email: true,
      phone: true,
      gender: true
    }
  });
}

findOne(id: number) {
  return this.adminRepository.findOne({
    where: { id },
    select: {
      id: true,
      fullName: true,
      age: true,
      status: true,
      username: true,
      email: true,
      phone: true,
      gender: true
    }
  });
}
//? For auth signin

async findOneByUsername(username: string) {
  const admin = await this.adminRepository.findOne({
  where: { username },
  relations: ['customers', 'orders', 'art'], // include related entities
});


  if (!admin) return null;

  return {
    ...admin,
    passwordHash: admin.password,
  };
}

//? For auth signin with password
async findOneWithPassword(id: number) {
  return this.adminRepository.findOne({
    where: { id },
    select: {
      id: true,
      fullName: true,
      age: true,
      status: true,
      username: true,
      email: true,
      phone: true,
      gender: true,
      password: true 
    }
  });
}



async updateStatus(id: number, status: 'active' | 'inactive') {
    const admin = await this.adminRepository.findOneBy({ id });
    if (!admin) {
      throw new BadRequestException('Admin not found');
    }
    admin.status = status;
    return this.adminRepository.save(admin);
  } 
  findByStatus(status: 'active' | 'inactive') {
    const selectFields: FindOptionsSelect<Admin> = {
      id: true,
      fullName: true,
      age: true,
      status: true,
      username: true,
      email: true,
      phone: true,
      gender: true,
    }; // Exclude nid and nidImage
    return this.adminRepository.find({
      where: { status },
      select: selectFields,
    });
  }

  findOlderThan40() {
    const selectFields: FindOptionsSelect<Admin> = {
      id: true,
      fullName: true,
      age: true,
      status: true,
      username: true,
      email: true,
      phone: true,
      gender: true,
    }; 
    return this.adminRepository.find({
      where: { age: MoreThan(40) },
      select: selectFields,
    });
  }


  async update(id: number, updateAdminDto: UpdateAdminDto) {
    const admin = await this.adminRepository.findOneBy({ id });
    if (!admin) {
      throw new BadRequestException('Admin not found');
    }
    Object.assign(admin, updateAdminDto);
    return this.adminRepository.save(admin);
  }

  async remove(id: number) {
    const admin = await this.adminRepository.findOneBy({ id });
    if (!admin) {
      throw new BadRequestException('Admin not found');
    }
    return this.adminRepository.remove(admin);
  }


  //? ---------------- CUSTOMER CRUD  ----------------

async createCustomer(adminId: number, customerData: Partial<Customer>) {
  const admin = await this.findOne(adminId);
  if (!admin) throw new HttpException('Admin not found', 404);

  const customer = this.customerRepository.create({
    ...customerData,
    admin,
  });

  return this.customerRepository.save(customer);
}

async updateCustomer(adminId: number, customerId: string, updateData: Partial<Customer>) {
  const customer = await this.customerRepository.findOne({
    where: { id: customerId, admin: { id: adminId } },
    relations: ['admin'],
  });

  if (!customer) throw new HttpException('Customer not found under this admin', 404);

  Object.assign(customer, updateData);
  return this.customerRepository.save(customer);
}

async removeCustomerById(adminId: number, customerId: string) {
  const customer = await this.customerRepository.findOne({
    where: { id: customerId, admin: { id: adminId } },
    relations: ['admin'],
  });

  if (!customer) throw new HttpException('Customer not found under this admin', 404);

  return this.customerRepository.remove(customer);
}

// ---------------- ART CRUD ----------------
// async createArt(adminId: string, data: Partial<Art>) {
//   const admin = await this.findOne(+adminId);
//   if (!admin) throw new HttpException('Admin not found', 404);

//   // Ensure artist is attached correctly
//   const art = this.artRepository.create({
//     ...data,
//     admin,
//     artist: data.artist ? { id: data.artist['id'] } as any : null,
//   });

//   return this.artRepository.save(art);
// }


//   async getAllArt(adminId: string) {
//     return this.artRepository.find({ where: { admin: { id: +adminId } }, relations: ['artist', 'admin'] });
//   }

//   async updateArt(adminId: string, artId: string, data: Partial<Art>) {
//     const art = await this.artRepository.findOne({
//       where: { id: artId, admin: { id: +adminId } },
//       relations: ['admin'],
//     });
//     if (!art) throw new HttpException('Art not found under this admin', 404);

//     Object.assign(art, data);
//     return this.artRepository.save(art);
//   }

//   async deleteArt(adminId: string, artId: string) {
//     const art = await this.artRepository.findOne({
//       where: { id: artId, admin: { id: +adminId } },
//       relations: ['admin'],
//     });
//     if (!art) throw new HttpException('Art not found under this admin', 404);

//     return this.artRepository.remove(art);
//   }

  // ---------------- ORDER UPDATE + DELETE ----------------
  async updateOrder(adminId: string, orderId: string, data: Partial<Order>) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, admin: { id: +adminId } },
      relations: ['admin', 'customer', 'orderItems'],
    });
    if (!order) throw new HttpException('Order not found under this admin', 404);

    Object.assign(order, data);
    return this.orderRepository.save(order);
  }

  async deleteOrder(adminId: string, orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, admin: { id: +adminId } },
      relations: ['admin'],
    });
    if (!order) throw new HttpException('Order not found under this admin', 404);

    return this.orderRepository.remove(order);
  }
//  async sendEmail(to: string, subject: string, body: string) {
//     console.log(`Email sent to ${to}: ${subject}`);
//     // here you would integrate nodemailer or another mailer
//     return { success: true };
//   }
}
