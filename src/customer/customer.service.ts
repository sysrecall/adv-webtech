import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { ILike, Repository } from 'typeorm';
import bcrypt from 'bcrypt';

@Injectable()
export class CustomerService {
  constructor(@InjectRepository(Customer) private customerRepositroy: Repository<Customer>) {}

  async create(createCustomerDto: CreateCustomerDto, profilePhotoPath: string | null) {
    const passwordHash = await bcrypt.hash(createCustomerDto.password, process.env.SALT_ROUNDS ?? 10);
    const { password, ...customerWithoutPassword } = createCustomerDto;

    let customer = this.customerRepositroy.create({
      ...customerWithoutPassword,
      passwordHash,
      profilePhotoPath: profilePhotoPath
    });

    return this.customerRepositroy.save(customer);
  }

  async findAll() {
    return this.customerRepositroy.find();
  }

  async findOne(id: string) {
    return this.customerRepositroy.findOneBy({ id: id });
  }

  async filterByName(name: string) {
    let customers = this.customerRepositroy.findBy({
      fullName: ILike(`%${name}%`),
    })
    return customers;
  }

  async findOneByUsername(username: string) {
    let customer = this.customerRepositroy.findOneBy({ username: username });
    return customer;
  }

  async removeOneByUsername(username: string) {
    let customer = await this.customerRepositroy.findOneBy({ username: username });
    
    if (customer)
      this.customerRepositroy.remove(customer);

    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    await this.customerRepositroy.update(id, updateCustomerDto);
    return this.customerRepositroy.findBy({id: id});
  }

  async remove(id: string) {
    await this.customerRepositroy.delete(id);
  }

}
