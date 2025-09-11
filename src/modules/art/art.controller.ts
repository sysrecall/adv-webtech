import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ArtService } from './art.service';
import { CreateArtDto } from './dto/create-art.dto';
import { UpdateArtDto } from './dto/update-art.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { Art } from './entities/art.entity';

@Controller("art")
export class ArtController {
  constructor(private readonly artService: ArtService) {}

  @Get("seed")
  async seed() {
    return await this.artService.seed();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Artist)
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Req() req, @Body() dto: CreateArtDto) {
    return this.artService.create(req.user.id, dto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.artService.findOne(id);
  }

  @Get()
  async findAll() {
    return await this.artService.findAll();
  }

  @Get('similar/style/:style')
  async similar(@Param('style') style: string) {
    return await this.artService.similar(style);
  }

  @Get('artist/:id/art')
  async findByArtist(@Param('id') id: string) {
    return this.artService.findByArtist(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Artist)
  @Patch(':id')
  async update(@Param('id') id: string, @Req() req, @Body() dto: UpdateArtDto) {
    return this.artService.update(id, req.user.id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Artist)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    return this.artService.remove(id, req.user.id);
  }
}