import { forwardRef, Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Customer } from 'src/modules/customer/entities/customer.entity';
import { AuthModule } from 'src/modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { Art } from 'src/modules/art/entities/art.entity';
import { Order } from 'src/modules/order/entities/order.entity';
import { ArtModule } from 'src/modules/art/art.module';
// import { MailerModule } from '@nestjs-modules/mailer';
import { OrderModule } from 'src/modules/order/order.module';
import { NotificationService } from 'src/modules/notification/notification.service';

@Module({
  imports:  [forwardRef(() => AuthModule), TypeOrmModule.forFeature([Admin,Customer ,Art, Order]), forwardRef(() => ArtModule),forwardRef(() => OrderModule),JwtModule], 
  controllers: [AdminController],
  providers: [AdminService,NotificationService],
  exports: [AdminService,NotificationService]
})
export class AdminModule {}
