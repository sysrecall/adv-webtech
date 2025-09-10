import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseInterceptors, UploadedFile, Res, Query, UseGuards, Req, Inject, forwardRef, NotFoundException, Response, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';
import { LoginCustomerDto } from './dto/login-customer.dto';
import { AuthService } from 'src/modules/auth/auth.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Request } from '@nestjs/common';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/role.decorator';

@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly authService: AuthService
  ) {}

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
      fileSize: 2*1024*1024,
    },
    storage: diskStorage({
      destination: './uploads/customer/profile-photos',
      filename: function (req, file, cb) {
        cb(null, Date.now()+file.originalname)
      }
    }) 
  }))
  @UsePipes(new ValidationPipe())
  async create(@Body() createCustomerDto: CreateCustomerDto, @UploadedFile() photo: Express.Multer.File, @Res() res) {
    const profilePhotoPath = photo ? photo.filename : null;
    await this.customerService.create(createCustomerDto, profilePhotoPath);
    return res.status(HttpStatus.CREATED).send();
  }

  @Post('login')
  async login(@Body() loginCustomerDto: LoginCustomerDto, @Res({passthrough: true}) res) {
    const { access_token } = await this.authService.signIn(loginCustomerDto.username, loginCustomerDto.password, 'customer');
    
    res.cookie('Authorization', `Bearer ${access_token}`, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: parseInt(process.env.JWT_COOKIE_EXPIRATION ?? "3600000")
    });
    res.status(HttpStatus.OK).send();
  }


  @UseGuards(AuthGuard)
  @Get('profile')
  async profile(@Request() request) {
    const user = await this.customerService.findOne(request.user.id);
    if (!user) { throw new UnauthorizedException('Not authorized to perform this action!'); }
    const { passwordHash, ...userWithoutPassHash } = user;

    return userWithoutPassHash;
  }

  @Roles(Role.Customer)
  @Get('testRoute')
  async testRoute() {
    return true;
  }

  @Get('all')
  async findAll() {
    return await this.customerService.findAll();
  }

  @Get('photo/:name')
  async getProfilePhoto(@Param('name') name: string, @Res() res) {
    res.sendFile(name, { root: './uploads/customer/profile-photos'})        
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


  @Patch('id/:id')
  async update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return await this.customerService.update(id, updateCustomerDto);
  }

  @Delete('id/:id')
  async remove(@Param('id') id: string) {
    return await this.customerService.remove(id);
  }
}
