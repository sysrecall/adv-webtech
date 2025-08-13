import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity'; // Update path as needed
import { Customer } from 'src/customer/entities/customer.entity'; // Update path as needed

@Module({
  imports: [TypeOrmModule.forFeature([Admin,Customer])], 
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
