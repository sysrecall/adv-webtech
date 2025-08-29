import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from './entities/artist.entity';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import * as bcrypt from 'bcrypt';
import { MailerService } from 'src/modules/mailer/mailer.service';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
  ) {}

  async create(dto: CreateArtistDto) {
    const existsByUsername = await this.artistRepository.findOne({ where: { username: dto.username } });
    if (existsByUsername) throw new BadRequestException('Username already exists');

    const existsByEmail = await this.artistRepository.findOne({ where: { email: dto.email } });
    if (existsByEmail) throw new BadRequestException('Email already exists');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const artist = this.artistRepository.create({
      username: dto.username,
      email: dto.email,
      bio: dto.bio ?? null,
      passwordHash,
    });

    const saved = await this.artistRepository.save(artist);

    return saved;
  }

  async findAll() {
    return this.artistRepository.find();
  }

  async findOne(id: string) {
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (!artist) throw new NotFoundException('Artist not found');
    return artist;
  }

  async findOneByUsername(username: string) {
    const artist = await this.artistRepository.findOne({ where: { username } });
    if (!artist) return null;
    return artist;
  }
  


  async update(id: string, dto: UpdateArtistDto) {
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (!artist) throw new NotFoundException('Artist not found');

    if (dto.username && dto.username !== artist.username) {
      const dup = await this.artistRepository.findOne({ where: { username: dto.username } });
      if (dup) throw new BadRequestException('Username already exists');
    }
    if (dto.email && dto.email !== artist.email) {
      const dup = await this.artistRepository.findOne({ where: { email: dto.email } });
      if (dup) throw new BadRequestException('Email already exists');
    }

    if (dto.password) {
      const salt = await bcrypt.genSalt(10);
      artist.passwordHash = await bcrypt.hash(dto.password, salt);
    }

    if (dto.username !== undefined) artist.username = dto.username;
    if (dto.email !== undefined) artist.email = dto.email;
    if (dto.bio !== undefined) artist.bio = dto.bio;

    return this.artistRepository.save(artist);
  }

  async remove(id: string) {
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (!artist) throw new NotFoundException('Artist not found');
    return this.artistRepository.remove(artist);
  }
}