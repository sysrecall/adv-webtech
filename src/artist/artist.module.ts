import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './entities/artist.entity';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { AuthModule } from 'src/modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from 'src/modules/mailer/mailer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Artist]),
    forwardRef(() => AuthModule),
    JwtModule,
    MailerModule,
  ],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {}
