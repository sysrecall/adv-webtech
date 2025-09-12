import { IsString, Matches, MinLength } from "class-validator";

export class ChangePasswordCustomer{
    @IsString()
    password: string;
    
    @MinLength(6)
    @Matches(/\S*[A-Z]\S*/g, {
        message: 'password must contain one uppercase letter'
    })
    newPassword: string;
}
