import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Art } from './entities/art.entity';
import { CreateArtDto } from './dto/create-art.dto';
import { UpdateArtDto } from './dto/update-art.dto';
import { Artist } from 'src/artist/entities/artist.entity';

@Injectable()
export class ArtService {
  constructor(
    @InjectRepository(Art) private readonly artRepository: Repository<Art>,
    @InjectRepository(Artist) private readonly artistRepository: Repository<Artist>,
  ) {}

  async create(artistId: string, dto: CreateArtDto) {
    const artist = await this.artistRepository.findOne({ where: { id: artistId } });
    if (!artist) throw new NotFoundException('Artist not found');

    const art = this.artRepository.create({
      ...dto,
      artist,
    });
    return this.artRepository.save(art);
  }

  async findAll() {
    return this.artRepository.find({ relations: ['artist'] });
  }

  async findByArtist(artistId: string) {
    return this.artRepository.find({ where: { artist: { id: artistId } }, relations: ['artist'] });
  }

  async update(artId: string, artistId: string, dto: UpdateArtDto) {
    const art = await this.artRepository.findOne({ where: { id: artId }, relations: ['artist'] });
    if (!art) throw new NotFoundException('Art not found');
    if (art.artist.id !== artistId) throw new ForbiddenException('Not authorized to update this art');

    Object.assign(art, dto);
    return this.artRepository.save(art);
  }

  async remove(artId: string, artistId: string) {
    const art = await this.artRepository.findOne({ where: { id: artId }, relations: ['artist'] });
    if (!art) throw new NotFoundException('Art not found');
    if (art.artist.id !== artistId) throw new ForbiddenException('Not authorized to delete this art');

    return this.artRepository.remove(art);
  }
}
