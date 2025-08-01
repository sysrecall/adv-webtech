import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistService {
  private artists: Artist[] = [];

  create(createArtistDto: CreateArtistDto): Artist {
    const newArtist: Artist = {
      id: this.artists.length + 1,
      ...createArtistDto,
    };
    this.artists.push(newArtist);
    return newArtist;
  }

  findAll(): Artist[] {
    return this.artists;
  }

  findByName(name: string): Artist[] {
    return this.artists.filter((artist) =>
      artist.name.toLowerCase().includes(name.toLowerCase()),
    );
  }

  findOne(id: number): Artist {
    const artist = this.artists.find((a) => a.id === id);
    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return artist;
  }

 update(id: number, updateDto: UpdateArtistDto): Artist {
  const artist = this.findOne(id);
  
  const updatedArtist = { ...artist };

  for (const key in updateDto) {
    if (updateDto[key] === null || updateDto[key] === '') {
      updatedArtist[key] = undefined; // or null, depending on preference
    } else {
      updatedArtist[key] = updateDto[key];
    }
  }

  const index = this.artists.findIndex((a) => a.id === id);
  this.artists[index] = updatedArtist;

  return updatedArtist;
}



  remove(id: number): void {
    const index = this.artists.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    this.artists.splice(index, 1);
  }
}
