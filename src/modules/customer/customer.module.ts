import { forwardRef, Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { AuthModule } from 'src/modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from 'src/common/guards/role.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([Customer]), JwtModule],
  controllers: [CustomerController],
  providers: [CustomerService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [CustomerService]
})
export class CustomerModule {}
