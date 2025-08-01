import {Controller,Get,Post,Patch,Delete,Param,Body,Query,ParseIntPipe,} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistService.create(createArtistDto);
  }

  @Get()
  find(@Query('name') name?: string) {
    if (name) {
      return this.artistService.findByName(name);
    }
    return this.artistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.artistService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    return this.artistService.update(id, updateArtistDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    this.artistService.remove(id);
    return { message: `Artist with ID ${id} deleted successfully.` };
  }
}
