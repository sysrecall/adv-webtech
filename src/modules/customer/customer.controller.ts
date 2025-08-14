import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseInterceptors, UploadedFile, Res, Query, UseGuards, Req, Inject, forwardRef, NotFoundException, Response, HttpCode, HttpStatus } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';
import { SignInCustomerDto } from './dto/signin-customer.dto';
import { AuthService } from 'src/modules/auth/auth.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Request } from '@nestjs/common';
import { Role } from 'src/common/enums/role.enum';
import { RequiredRole } from 'src/common/decorators/role.decorator';

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
  async create(@Body() createCustomerDto: CreateCustomerDto, @UploadedFile() photo: Express.Multer.File) {
    const profilePhotoPath = photo ? photo.filename : null;
    return await this.customerService.create(createCustomerDto, profilePhotoPath);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@Body() signInCustomerDto: SignInCustomerDto, @Res({passthrough: true}) res) {
    const { access_token } = await this.authService.signIn(signInCustomerDto.username, signInCustomerDto.password, 'customer');
      res.cookie('Authorization', `Bearer ${access_token}`, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: parseInt(process.env.JWT_COOKIE_EXPIRATION ?? "3600000")
    });
    res.send();
  }


  @UseGuards(AuthGuard)
  @Get('profile')
  async profile(@Request() request) {
    const user = await this.customerService.findOne(request.user.id);
    if (!user) { throw new NotFoundException('No user found!'); }
    const { passwordHash, ...userWithoutPassHash } = user;

    return userWithoutPassHash;
  }

  @RequiredRole(Role.Customer)
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
