import { IsString, Length } from 'class-validator';

export class UpdateArtistCountryDto {
  @IsString()
  @Length(1, 30)
  country: string;
}
