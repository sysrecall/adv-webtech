import { Injectable, BadRequestException, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, MoreThan, Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Customer } from 'src/modules/customer/entities/customer.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {

  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>
  ) {}
  // create(createAdminDto: CreateAdminDto) {
    
  //   console.log(createAdminDto)
  //   return `This action returns all admin`;

  // }
async create(createAdminDto: CreateAdminDto) {
  const { nidImage, password, ...rest } = createAdminDto;

  // 🔹 Generate salt
  const salt = await bcrypt.genSalt(10);

  // 🔹 Hash password with salt
  const hashedPassword = await bcrypt.hash(password, salt);

  // 🔹 Create admin entity
  const admin = this.adminRepository.create({
    ...rest,
    password: hashedPassword, // store hashed password
    nidImage: nidImage.buffer, // only pass the buffer for image
    status: createAdminDto.status || 'active',
  });

  // 🔹 Save to database
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
    }; // Exclude nid and nidImage
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


  //? Relationship CRUD operations for Admin -> Customer (OneToMany)

  // async addCustomer(adminId: number, customerId: number) {
  //   const admin = await this.findOne(adminId);
  //   const customer = await this.customerRepository.findOneBy({ id: customerId.toString() });
  //   if (!admin || !customer) {
  //     throw new HttpException('Admin or Customer not found', 404);
  //   }
  //   admin.customers.push(customer);
  //   return this.adminRepository.save(admin);
  // }

  // async removeCustomer(adminId: number, customerId: number) {
  //   const admin = await this.findOne(adminId);
  //   if (!admin) {
  //     throw new HttpException('Admin not found', 404);
  //   }
  //   admin.customers = admin.customers.filter(c => c.id !== customerId.toString());
  //   return this.adminRepository.save(admin);
  // }

  // async getCustomers(adminId: number) {
  //   const admin = await this.findOne(adminId);
  //   if (!admin) {
  //     throw new HttpException('Admin not found', 404);
  //   }
  //   return admin.customers;
  // }

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

}
