import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { MailerDto } from './dto/mailer.dto';

@Injectable()
export class MailerService {
    async sendWelcomeMail(email: string, username: string) {
        const subject = 'Welcome to Art Store';
        const html = `<h3>Welcome, ${username}!</h3><p>Thanks for registering as an artist at Art Store. We are excited to see your creations.</p>`;
        const dto: MailerDto = {
            recipients: [email],
            subject,
            html,
            text: `Welcome, ${username}! Thanks for registering as an artist at Art Store.`
        } as any;
        return this.sendEmail(dto);
    }
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
