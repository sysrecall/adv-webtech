import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ArtService } from './art.service';
import { CreateArtDto } from './dto/create-art.dto';
import { UpdateArtDto } from './dto/update-art.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';

@Controller()
export class ArtController {
  constructor(private readonly artService: ArtService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Artist)
  @Post('art')
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Req() req, @Body() dto: CreateArtDto) {
    return this.artService.create(req.user.id, dto);
  }

  @Get('art')
  async findAll() {
    return this.artService.findAll();
  }

  @Get('artist/:id/art')
  async findByArtist(@Param('id') id: string) {
    return this.artService.findByArtist(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Artist)
  @Patch('art/:id')
  async update(@Param('id') id: string, @Req() req, @Body() dto: UpdateArtDto) {
    return this.artService.update(id, req.user.id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Artist)
  @Delete('art/:id')
  async remove(@Param('id') id: string, @Req() req) {
    return this.artService.remove(id, req.user.id);
  }


}