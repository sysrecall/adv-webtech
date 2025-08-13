import { IsOptional, IsString, Length } from 'class-validator';

export class CreateArtistDto {
  @IsOptional()
  @IsString()
  @Length(1, 30)
  country?: string;
}
