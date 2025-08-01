import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, MoreThan, Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';


@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}
  // create(createAdminDto: CreateAdminDto) {
    
  //   console.log(createAdminDto)
  //   return `This action returns all admin`;

  // }
  async create(createAdminDto: CreateAdminDto) {
    const { nidImage, ...rest } = createAdminDto;

    const admin = this.adminRepository.create({
      ...rest,
      nidImage: nidImage.buffer, // ✅ only pass the buffer
      status: createAdminDto.status || 'active',
    });

    return this.adminRepository.save(admin);
  }


findAll() {
    return this.adminRepository.find();
  }

  findOne(id: number) {
    return this.adminRepository.findOneBy({ id });
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
}
