import { IsString } from "class-validator";

export class LoginCustomerDto {
    @IsString()
    username: string;
    @IsString()
    password: string;
}
