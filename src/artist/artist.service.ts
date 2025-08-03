import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from './entities/artist.entity';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistCountryDto } from './dto/update-artist-country.dto';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepo: Repository<Artist>,
  ) {}

  async create(dto: CreateArtistDto): Promise<Artist> {
    const artist = this.artistRepo.create(dto);
    return this.artistRepo.save(artist);
  }

 async updateCountry(id: number, dto: UpdateArtistCountryDto): Promise<Artist | null> {
  await this.artistRepo.update(id, { country: dto.country });
  return this.artistRepo.findOneBy({ id });
}


  async findByJoiningDate(date: string): Promise<Artist[]> {
    return this.artistRepo
      .createQueryBuilder('artist')
      .where('DATE(artist.joiningDate) = :date', { date })
      .getMany();
  }

  async findByUnknownCountry(): Promise<Artist[]> {
    return this.artistRepo.find({ where: { country: 'Unknown' } });
  }
}
