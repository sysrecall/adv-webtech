import { IsEmail, IsIn, IsNotEmpty, IsNumberString, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
export class EditCustomerDto {
    id: string;

    username: string;

    email: string;

    fullName: string;

    billingAddress: string;

    shippingAddress: string;

    phone: string;
    
    @IsOptional()
    @Transform(({ value }) => value.toLowerCase())
    @IsIn(['male', 'female'])
    gender: string;

}

