import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { CreateArtDto } from './dto/create-art.dto';
import { UpdateArtDto } from './dto/update-art.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Art } from './entities/art.entity';
import { Repository } from 'typeorm';
import { Artist } from 'src/artist/entities/artist.entity';

@Injectable()
export class ArtService {
  constructor(
    @InjectRepository(Art) private readonly artRepository: Repository<Art>, 
    @InjectRepository(Artist) private readonly artistRepository: Repository<Artist>,
  ) {}

  async create(createArtDto: CreateArtDto) {
    const artist = await this.artistRepository.findOneBy({ id: createArtDto.artistId });    
    if (!artist) throw new PreconditionFailedException("Invalid artist id.");

    const {artistId, ..._art} = createArtDto;
    const art = this.artRepository.create({
      ..._art,
      artist: artist
    });

    return this.artRepository.save(art);  
  }

  async findAll() {
    return this.artRepository.find();
  }

  async findOne(id: string) {
    return this.artRepository.findOneBy({id: id});
  }

  async update(id: string, updateArtDto: UpdateArtDto) {
    await this.artRepository.update(id, updateArtDto);
    return this.artRepository.findOneBy({id: id});
  }

  async remove(id: string) {
    return this.artRepository.delete({id: id});
  }
}
