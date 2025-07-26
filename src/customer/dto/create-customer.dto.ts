import { Transform } from "class-transformer";
import { IsEmail, IsIn, IsNotEmpty, IsNumberString, Matches, MinLength  } from "class-validator";

export class CreateCustomerDto {
    username: string;
    @MinLength(6)
    @Matches(/\S*[A-Z]\S*/g, {
        message: 'password must contain one uppercase letter'
    })
    password: string;
    @IsNotEmpty()
    @IsEmail()
    @Matches(/\S+aiub.edu$/, {
        message: 'email must have aiub.edu domain'
    })
    email: string;
    fullName: string;
    billingAddress: string;
    shippingAddress: string;
    @IsNumberString()
    phone: string;
    @Transform(({ value }) => value.toLowerCase())
    @IsIn(['male', 'female'])
    gender: string;
}
