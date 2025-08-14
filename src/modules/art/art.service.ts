import { Injectable } from '@nestjs/common';
import { CreateArtDto } from './dto/create-art.dto';
import { UpdateArtDto } from './dto/update-art.dto';

@Injectable()
export class ArtService {
  create(createArtDto: CreateArtDto) {
    return 'This action adds a new art';
  }

  findAll() {
    return `This action returns all art`;
  }

  findOne(id: number) {
    return `This action returns a #${id} art`;
  }

  update(id: number, updateArtDto: UpdateArtDto) {
    return `This action updates a #${id} art`;
  }

  remove(id: number) {
    return `This action removes a #${id} art`;
  }
}
