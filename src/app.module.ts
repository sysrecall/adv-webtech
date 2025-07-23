import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { ArtistModule } from './artist/artist.module';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [AdminModule, ArtistModule, CustomerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
