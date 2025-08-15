import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class MailerDto {
    @IsEmail({},{each: true})
    recipients: string[];

    @IsString()
    subject: string;

    @IsString()
    html: string;

    @IsString()
    @IsOptional()
    text?: string;
}