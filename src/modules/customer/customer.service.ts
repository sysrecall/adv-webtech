import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { EditCustomerDto } from './dto/edit-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { ILike, Repository } from 'typeorm';
import { compare, genSalt, hash } from 'bcrypt';



@Injectable()
export class CustomerService {
  constructor(@InjectRepository(Customer) private customerRepositroy: Repository<Customer>) { }

  async generatePasswordHash(password: string) {
    const salt = await genSalt(parseInt(process.env.SALT_ROUNDS ?? "10"));
    return hash(password, salt);
  }

  async create(createCustomerDto: CreateCustomerDto, profilePhotoPath: string | null) {
    const { password, ...customerWithoutPassword } = createCustomerDto;
    const passwordHash = await this.generatePasswordHash(createCustomerDto.password);

    let customer = this.customerRepositroy.create({
      ...customerWithoutPassword,
      passwordHash,
      profilePhotoPath: profilePhotoPath
    });

    return this.customerRepositroy.save(customer);
  }

  async edit(id: string, editCustomerDto: Omit<EditCustomerDto, 'id'>, profilePhotoPath: string | null) {
    const customer = { ...editCustomerDto };
    if (profilePhotoPath !== null) {
      customer['profilePhotoPath'] = profilePhotoPath;
    }

    return this.customerRepositroy.update(id, customer);
  }

  async changePassword(id: string, oldPassword: string, newPassword: string) {
    const user = await this.findOne(id);
    if (!user) throw new UnauthorizedException();

    const result = await compare(oldPassword, user.passwordHash);
    if (!result) throw new HttpException("Invalid Password", HttpStatus.FORBIDDEN);

    const passwordHash = await this.generatePasswordHash(newPassword);
    return this.customerRepositroy.update(id, {passwordHash: passwordHash});
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

  // async update(id: string, updateCustomerDto: UpdateCustomerDto) {
  //   await this.customerRepositroy.update(id, updateCustomerDto);
  //   return this.customerRepositroy.findBy({id: id});
  // }

  async remove(id: string) {
    await this.customerRepositroy.delete(id);
  }

}
