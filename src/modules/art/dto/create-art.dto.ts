import { IsEmail, IsIn, IsNotEmpty, IsNumber, IsNumberString, IsString, Matches, MinLength  } from "class-validator";

export class CreateArtDto {
    @IsString()
    title: string;
    @IsString()
    artistId: number;
    @IsString()
    url: string;
    @IsNumber()
    price: number;
    @IsString()
    subject: string;
    @IsString()
    style: string;
    @IsString()
    desc: string;
}
