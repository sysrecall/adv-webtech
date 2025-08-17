import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Art } from './entities/art.entity';
import { ArtService } from './art.service';
import { ArtController } from './art.controller';
import { Artist } from 'src/artist/entities/artist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Art, Artist])],
  controllers: [ArtController],
  providers: [ArtService],
  exports: [ArtService],
})
export class ArtModule {}
