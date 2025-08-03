import {
  Controller,
  Post,
  Patch,
  Get,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistCountryDto } from './dto/update-artist-country.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  create(@Body() dto: CreateArtistDto) {
    return this.artistService.create(dto);
  }

  @Patch(':id')
  updateCountry(@Param('id') id: string, @Body() dto: UpdateArtistCountryDto) {
    return this.artistService.updateCountry(+id, dto);
  }

  @Get('by-date')
  findByJoiningDate(@Query('date') date: string) {
    return this.artistService.findByJoiningDate(date);
  }

  @Get('unknown-country')
  findByUnknownCountry() {
    return this.artistService.findByUnknownCountry();
  }
}
