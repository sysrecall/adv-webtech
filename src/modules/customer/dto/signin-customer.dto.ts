import { IsString } from "class-validator";

export class SignInCustomerDto {
    @IsString()
    username: string;
    @IsString()
    password: string;
}
