import { Module } from '@nestjs/common';
import { ArtService } from './art.service';
import { ArtController } from './art.controller';

@Module({
  controllers: [ArtController],
  providers: [ArtService],
})
export class ArtModule {}
