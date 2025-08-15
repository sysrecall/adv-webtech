import { forwardRef, Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity'; // Update path as needed
import { Customer } from '../modules/customer/entities/customer.entity'; // Update path as needed
import { AuthModule } from '../modules/auth/auth.module'; // Update path as needed
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:  [forwardRef(() => AuthModule), TypeOrmModule.forFeature([Admin,Customer]), JwtModule], 
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService]
})
export class AdminModule {}
