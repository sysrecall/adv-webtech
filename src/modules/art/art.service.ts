import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Art } from './entities/art.entity';
import { CreateArtDto } from './dto/create-art.dto';
import { UpdateArtDto } from './dto/update-art.dto';
import { ArtistService } from 'src/artist/artist.service';
import { data } from '../art/seed/seed';

@Injectable()
export class ArtService {
  constructor(
    @InjectRepository(Art)
    private readonly artRepository: Repository<Art>,
    private readonly artistService: ArtistService
  ) { }

  async seed() {
    const artistId = "ca5013ca-cc12-443c-bfc2-6306f32b3962";
    const artist = await this.artistService.findOne(artistId);
    data.forEach(d => {
      if (!artist) throw new NotFoundException('Artist not found');

      const art = this.artRepository.create({
        ...d,
        artist,
      });
      return this.artRepository.save(art);

    })
  }

  async create(artistId: string, dto: CreateArtDto) {
    const artist = await this.artistService.findOne(artistId);
    if (!artist) throw new NotFoundException('Artist not found');

    const art = this.artRepository.create({
      ...dto,
      artist,
    });
    return this.artRepository.save(art);
  }

  async similar(style: string) {
    return this.artRepository.find({
      take: 4,
      where: {
        style: style
      },
      relations: ['artist']
    });
  }

  async findAll() {
    return this.artRepository.find({ relations: ['artist'] });
  }

  async findOne(artId: string) {
    const art = await this.artRepository.findOne({
      where: { id: artId },
      relations: ['artist'],
    });

    if (!art) {
      throw new NotFoundException('Art not found');
    }

    return art;
  }

  async update(artId: string, artistId: string, dto: UpdateArtDto) {
    try {
      const art = await this.artRepository.findOne({
        where: { id: artId },
        relations: ['artist'],
      });

      if (!art) throw new NotFoundException('Art not found');

      if (String(art.artist.id) !== String(artistId)) {
        throw new ForbiddenException('Not authorized to update this art');
      }


      const updated = this.artRepository.merge(art, dto);
      return await this.artRepository.save(updated);
    } catch (err) {
      console.error('Update error:', err);
      throw err;
    }
  }


  async remove(artId: string, artistId: string) {
    const art = await this.artRepository.findOne({
      where: { id: artId },
      relations: ['artist'],
    });
    if (!art) throw new NotFoundException('Art not found');
    if (art.artist.id !== artistId)
      throw new ForbiddenException('Not authorized to delete this art');

    return this.artRepository.remove(art);
  }

  async findByArtist(artistId: string) {
    return this.artRepository.find({
      where: { artist: { id: artistId } },
      relations: ['artist'],
    });
  }
}