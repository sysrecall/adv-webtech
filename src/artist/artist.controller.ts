import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Req, Res, UseGuards, UsePipes, ValidationPipe, UnauthorizedException } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { LoginArtistDto } from './dto/login-artist.dto';
import { AuthService } from 'src/modules/auth/auth.service';
import { Response } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { RequiredRole } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';

@Controller('artist')
export class ArtistController {
  constructor(
    private readonly artistService: ArtistService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Body() dto: CreateArtistDto) {
    return this.artistService.create(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginArtistDto, @Res({ passthrough: true }) res: Response) {
    const { access_token } = await this.authService.signIn(dto.username, dto.password, 'artist');

    res.cookie('Authorization', `Bearer ${access_token}`, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: parseInt(process.env.JWT_COOKIE_EXPIRATION ?? '3600000'),
    });

    return { message: 'Login successful' };
  }

  @Get()
  async findAll() {
    return this.artistService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.artistService.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @RequiredRole(Role.Artist)
  @Put(':id')
  async update(@Param('id') id: string, @Req() req, @Body() dto: UpdateArtistDto) {
    if (req.user.id !== id) throw new UnauthorizedException('Not authorized to update this artist');
    return this.artistService.update(id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @RequiredRole(Role.Artist)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    if (req.user.id !== id) throw new UnauthorizedException('Not authorized to delete this artist');
    return this.artistService.remove(id);
  }
}