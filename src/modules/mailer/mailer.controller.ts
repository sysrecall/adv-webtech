import { Body, Controller, Post } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerDto } from './dto/mailer.dto';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('send')
  async sendEmail(@Body() dto: MailerDto) {
    await this.mailerService.sendEmail(dto);
    return { message: 'Email sent successfully' };
  }
}
