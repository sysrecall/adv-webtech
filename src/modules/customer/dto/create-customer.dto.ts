import { Transform } from "class-transformer";
import { IsEmail, IsIn, IsNotEmpty, IsNumberString, IsString, Matches, MinLength  } from "class-validator";

export class CreateCustomerDto {
    @IsString()
    username: string;
    @MinLength(6)
    @Matches(/\S*[A-Z]\S*/g, {
        message: 'password must contain one uppercase letter'
    })
    password: string;
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsString()
    fullName: string;
    @IsNumberString()
    phone: string;
    // @Transform(({ value }) => value.toLowerCase())
    // @IsIn(['male', 'female'])
    // gender: string;
}
