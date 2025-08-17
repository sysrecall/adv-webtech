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
import { MailerModule } from 'src/modules/mailer/mailer.module';
import { OrderModule } from 'src/modules/order/order.module';

@Module({
  imports:  [forwardRef(() => AuthModule), TypeOrmModule.forFeature([Admin,Customer ,Art, Order]), forwardRef(() => ArtModule),forwardRef(() => OrderModule),JwtModule,MailerModule], 
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService]
})
export class AdminModule {}
