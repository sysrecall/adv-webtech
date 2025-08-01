import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity'; // Update path as needed


@Module({
  imports: [AdminModule,TypeOrmModule.forRoot(
    {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123',
      database: 'Project',
      autoLoadEntities: true,
      synchronize: true,
    }),
 TypeOrmModule.forFeature([Admin]) ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
