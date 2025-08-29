import { IsString } from "class-validator";


export class AdminSignInDto {
    @IsString()
    username: string;
    @IsString()
    password: string;
}