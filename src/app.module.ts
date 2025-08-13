import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { ArtistModule } from './artist/artist.module';
import { CustomerModule } from './customer/customer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AdminModule, ArtistModule, CustomerModule,
    ConfigModule.forRoot({
      envFilePath: '.env.local',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '123',
    database: 'art_store',
    autoLoadEntities: true,
    synchronize: true
  }),
],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
