import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseInterceptors, UploadedFile, Res, Query, UseGuards, Req, Inject, forwardRef, NotFoundException, Response, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { EditCustomerDto } from './dto/edit-customer.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';
import { LoginCustomerDto } from './dto/login-customer.dto';
import { AuthService } from 'src/modules/auth/auth.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Request } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordCustomer } from './dto/change-password-customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly authService: AuthService,
    private jwtService: JwtService
  ) { }

  @Post()
  @UseInterceptors(FileInterceptor('photo', {
    fileFilter: (req, file, cb) => {
      if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/)) {
        cb(null, true);
      } else {
        cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
      }
    },
    limits: {
      fileSize: 2 * 1024 * 1024,
    },
    storage: diskStorage({
      destination: './uploads/customer/profile-photos',
      filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
      }
    })
  }))
  @UsePipes(new ValidationPipe())
  async create(@Body() createCustomerDto: CreateCustomerDto, @UploadedFile() photo: Express.Multer.File, @Res() res) {
    const profilePhotoPath = photo ? photo.filename : null;
    await this.customerService.create(createCustomerDto, profilePhotoPath);
    return res.status(HttpStatus.CREATED).send();
  }

  @UseInterceptors(FileInterceptor('photo', {
    fileFilter: (req, file, cb) => {
      if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/)) {
        cb(null, true);
      } else {
        cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
      }
    },
    limits: {
      fileSize: 2 * 1024 * 1024,
    },
    storage: diskStorage({
      destination: './uploads/customer/profile-photos',
      filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
      }
    })
  }))
  @UsePipes(new ValidationPipe())
  @Patch('edit')
  async edit(@Body() editCustomerDto: EditCustomerDto, @UploadedFile() photo: Express.Multer.File, @Req() req, @Res() res) {
    if (Object.keys(editCustomerDto).length == 0) {
      return res.status(HttpStatus.BAD_REQUEST).send();
    }
    const token = this.extractTokenFromCookie(req);

    if (!token) { throw new UnauthorizedException('No token provided!'); }

    try {
      const user = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET });
      const profilePhotoPath = photo ? "uploads/customer/profile-photos/" + photo.filename : null;
      const { id, ...dto } = editCustomerDto;
      await this.customerService.edit(user.id, dto, profilePhotoPath);
      return res.status(HttpStatus.ACCEPTED).send();
    } catch (e) {
      throw e;
    }
  }

  private extractTokenFromCookie(request): string | undefined {
    const [type, token] = request.cookies?.Authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  @Post('login')
  async login(@Body() loginCustomerDto: LoginCustomerDto, @Res({ passthrough: true }) res) {
    const { access_token } = await this.authService.signIn(loginCustomerDto.username, loginCustomerDto.password, 'customer');

    res.cookie('Authorization', `Bearer ${access_token}`, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: parseInt(process.env.JWT_COOKIE_EXPIRATION ?? "3600000")
    });
    res.cookie('isLoggedIn', 'true', {
      httpOnly: false,
      secure: true,
      sameSite: 'None',
      maxAge: parseInt(process.env.JWT_COOKIE_EXPIRATION ?? "3600000")
    });
    res.status(HttpStatus.OK).send();
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res) {
    res.cookie('Authorization', '');
    res.cookie('isLoggedIn', 'false');
    return { status: HttpStatus.OK, message: 'Logged out successfully' };
    // res.cookies.Authorization = null;
    // return res.send();
  }

  @Patch('change-password')
  async changePassword(@Body() changePasswordCustomer: ChangePasswordCustomer, @Req() req) {
    const token = this.extractTokenFromCookie(req);
    if (!token) { throw new UnauthorizedException('No token provided!'); }

    try {
      const user = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET });
      console.log(user);
      await this.customerService.changePassword(
        user.id, 
        changePasswordCustomer.password, 
        changePasswordCustomer.newPassword
      );
    } catch (e) {
      throw e;
    }
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async profile(@Request() request) {
    const user = await this.customerService.findOne(request.user.id);
    if (!user) { throw new UnauthorizedException('Not authorized to perform this action!'); }
    const { passwordHash, ...userWithoutPassHash } = user;

    return userWithoutPassHash;
  }

  @Get()
  async findOneWithCookie(@Req() req) {
    const token = this.extractTokenFromCookie(req);
    if (!token) { throw new UnauthorizedException('No token provided!'); }

    try {
      const data = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET });
      const user: {passwordHash: string} | null = await this.customerService.findOne(data.id);
      if (user) {
        const {passwordHash, ...cleanded} = user;
        return cleanded;
      }
    } catch (e) {
      throw e;
    }
  }

  @Get('all')
  async findAll() {
    return await this.customerService.findAll();
  }

  @Get('photo/:name')
  async getProfilePhoto(@Param('name') name: string, @Res() res) {
    res.sendFile(name, { root: './uploads/customer/profile-photos' })
  }

  @Get('id/:id')
  async findOne(@Param('id') id: string) {
    return await this.customerService.findOne(id);
  }

  @Get('find')
  async filterByName(@Query('fullName') fullName: string) {
    return await this.customerService.filterByName(fullName);
  }

  @Get('username/:username')
  async username(@Param('username') username: string) {
    return await this.customerService.findOneByUsername(username);
  }

  @Delete('username/:username')
  async removeOneByUsername(@Param('username') username: string) {
    return await this.customerService.removeOneByUsername(username);
  }


  // @Patch('id/:id')
  // async update(@Param('id') id: string, @Body() updateCustomerDto: EditCustomerDto) {
  //   return await this.customerService.update(id, updateCustomerDto);
  // }

  @Delete('id/:id')
  async remove(@Param('id') id: string) {
    return await this.customerService.remove(id);
  }
}
