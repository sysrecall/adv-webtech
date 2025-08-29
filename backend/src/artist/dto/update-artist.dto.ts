import { PartialType } from '@nestjs/mapped-types';
import { CreateArtistDto } from './create-artist.dto';
import { IsOptional, Matches, MinLength } from 'class-validator';

export class UpdateArtistDto extends PartialType(CreateArtistDto) {
  @IsOptional()
  @MinLength(6)
  @Matches(/\S*[A-Z]\S*/g, { message: 'password must contain one uppercase letter' })
  password?: string;
}