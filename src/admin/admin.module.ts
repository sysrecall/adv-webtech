import { forwardRef, Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity'; // Update path as needed
import { Customer } from '../modules/customer/entities/customer.entity'; // Update path as needed
import { AuthModule } from '../modules/auth/auth.module'; // Update path as needed
import { JwtModule } from '@nestjs/jwt';
import { Art } from 'src/modules/art/entities/art.entity';
import { Order } from 'src/modules/order/entities/order.entity';
import { ArtModule } from 'src/modules/art/art.module';
import { MailerModule } from '../modules/mailer/mailer.module';
import { OrderModule } from 'src/modules/order/order.module';

@Module({
  imports:  [forwardRef(() => AuthModule), TypeOrmModule.forFeature([Admin,Customer ,Art, Order]), forwardRef(() => ArtModule),forwardRef(() => OrderModule),JwtModule,MailerModule], 
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService]
})
export class AdminModule {}
