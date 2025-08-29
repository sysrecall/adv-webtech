import { IsString } from 'class-validator';

export class LoginArtistDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}