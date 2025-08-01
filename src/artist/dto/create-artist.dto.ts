import { IsString, Matches, IsDateString, IsUrl, IsOptional } from 'class-validator';

export class CreateArtistDto {
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Name must not contain numbers or special characters',
  })
  name: string;

  @IsString()
  @Matches(/^(?=.*[@#$&]).+$/, {
    message: 'Password must contain at least one special character (@, #, $, &)',
  })
  password: string;

  @IsDateString({}, { message: 'Date must be a valid ISO date string' })
  birthDate: string;

  @IsOptional()
  @IsUrl({}, { message: 'Facebook link must be a valid URL' })
  facebookLink?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Twitter link must be a valid URL' })
  twitterLink?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Instagram link must be a valid URL' })
  instagramLink?: string;
}
