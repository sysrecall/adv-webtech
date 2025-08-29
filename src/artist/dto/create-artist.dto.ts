import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class CreateArtistDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @MinLength(6)
  @Matches(/\S*[A-Z]\S*/g, { message: 'password must contain one uppercase letter' })
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  bio?: string;
}