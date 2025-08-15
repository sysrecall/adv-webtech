import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { MailerDto } from './dto/mailer.dto';

@Injectable()
export class MailerService {
    constructor(private readonly configService: ConfigService) {}

    emailTransporter() {
        const transporter = nodemailer.createTransport({
            host: this.configService.get<string>('EMAIL_HOST'),
            port: this.configService.get<number>('EMAIL_PORT'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: this.configService.get<string>('EMAIL_USER'),
                pass: this.configService.get<string>('EMAIL_PASSWORD'),
            },
        });
        return transporter;
    }

    async sendEmail(dto:MailerDto){
        const{ recipients, subject, html, text } = dto;
        const transporter = this.emailTransporter();

        const options: nodemailer.SendMailOptions = {
            from: this.configService.get<string>('EMAIL_USER'),
            to: recipients,
            subject:subject,
            html: html,
            text: text || '',
        };
        try {
            await transporter.sendMail(options);
            return { message: 'Email sent successfully' };
        } catch (error) {
            console.error('Error sending email:', error);
            throw error; // re-throw to see it in Postman/Nest logs
        }


    }

}
