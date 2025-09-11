import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, UsePipes, ValidationPipe, NotFoundException , UseGuards, Res, ParseIntPipe} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage, MulterError } from 'multer';
import { Customer } from 'src/modules/customer/entities/customer.entity';
import { AuthService } from '../modules/auth/auth.service';
import { Request } from '@nestjs/common';
import { AdminSignInDto } from './dto/admin-signin.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { Art } from 'src/modules/art/entities/art.entity';
import { Order } from 'src/modules/order/entities/order.entity';
import { Response } from 'express';
// import { MailerService } from '@nestjs-modules/mailer';

@Controller('admin')
export class AdminController {
  // mailerService: any;
  // authService: any;
  constructor(private readonly adminService: AdminService,
    private readonly authService: AuthService,
    // private readonly mailerService: MailerService
  ) {}
  
//? Admin registration endpoint with file upload
  @Post('register')
  @UseInterceptors(FileInterceptor('nidImage', {
    fileFilter: (req, file, cb) => {
      if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/)) {
        cb(null, true);
      } else {
        cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'nidImage'), false);
      }
    },
    limits: {
      fileSize: 2 * 1024 * 1024,
    },
    // storage: diskStorage({
    //   destination: './uploads/admin/nid',
    //   filename: function (req, file, cb) {
    //     cb(null, Date.now() + file.originalname)
    //   }
    // }) 
    storage: memoryStorage()
  }))
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createAdminDto: CreateAdminDto, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('NID image is required and must be under 2MB');
    }
    (createAdminDto as any).nidImage = file;
    console.log(file.path)

    return this.adminService.create(createAdminDto);
  }

  
//? Admin SignIn endpoint 
  @Post('signin')
  async signIn(
    @Body() adminSignInDto: AdminSignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // 🔹 Authenticate admin
    const { access_token } = await this.authService.signIn(
      adminSignInDto.username,
      adminSignInDto.password,
      'admin',
    );

    // 🔹 Set cookie with JWT
    res.cookie('Authorization', `Bearer ${access_token}`, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: parseInt(process.env.JWT_EXPIRES_IN ?? '3600000'),
    });

    // 🔹 Send login notification email
    // await this.mailerService.sendMail({
    //   to: [process.env.EMAIL_USER || 'sifat.sai3@gmail.com'], // you can also use adminSignInDto.email if available
    //   subject: 'Admin Login Alert',
    //   html: `<h3>Hello Admin,</h3>
    //          <p>You have successfully signed in at: ${new Date().toLocaleString()}</p>
    //          <p>If this wasn’t you, please secure your account immediately.</p>`,
    //   text: `You signed in at ${new Date().toLocaleString()}`,
    // });

    // ✅ Response
    return { message: 'SignIn successful, email sent' };
  }

  //? Adminn profile endpoint
  
@UseGuards(AuthGuard, RolesGuard) 
@Roles(Role.Admin) 
@Get('profile')
  async profile(@Request() request) {
    console.log(request.user);
    const admin = await this.adminService.findOneWithPassword(request.user.id);
    if (!admin) {
      throw new NotFoundException('No admin found!');
    }
    const { password, ...rest } = admin;
    return rest;
  }


//? Get Admin list 
  @Get()
  findAll() {
    return this.adminService.findAll();
  }
//? Get Admin by ID

@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return this.adminService.findOne(id);
}

//? update Admin by status

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: 'active' | 'inactive') {
    return this.adminService.updateStatus(+id, status);

  }

//? Get Admin by status

  @Get('status/inactive')
  findInactive() {
    return this.adminService.findByStatus('inactive');
  }

  @Get('age/older-than-40')
  findOlderThan40() {
    return this.adminService.findOlderThan40();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }




    //? ---------------- CUSTOMER CRUD  ----------------

@Post(':id/customers')
createCustomer(
  @Param('id') id: string,
  @Body() customerData: Customer, 
) {
  return this.adminService.createCustomer(+id, customerData);
}

@Patch(':id/customers/:customerId')
updateCustomer(
  @Param('id') id: string,
  @Param('customerId') customerId: string,
  @Body() updateData: Customer, 
) {
  return this.adminService.updateCustomer(+id, customerId, updateData);
}

@Delete(':id/customers/:customerId')
removeCustomerById(
  @Param('id') id: string,
  @Param('customerId') customerId: string,
) {
  return this.adminService.removeCustomerById(+id, customerId);
}

// ---------------- ART CRUD ----------------
  // @Post(':id/art')
  // createArt(@Param('id') id: string, @Body() data: Partial<Art>) {
  //   return this.adminService.createArt(id, data);
  // }

  // @Get(':id/art')
  // getAllArt(@Param('id') id: string) {
  //   return this.adminService.getAllArt(id);
  // }

  // @Patch(':id/arts/:artId')
  // updateArt(@Param('id') id: string, @Param('artId') artId: string, @Body() data: Partial<Art>) {
  //   return this.adminService.updateArt(id, artId, data);
  // }

  // @Delete(':id/arts/:artId')
  // deleteArt(@Param('id') id: string, @Param('artId') artId: string) {
  //   return this.adminService.deleteArt(id, artId);
  // }

  // ---------------- ORDER UPDATE + DELETE ----------------
  @Patch(':id/orders/:orderId')
  updateOrder(@Param('id') id: string, @Param('orderId') orderId: string, @Body() data: Partial<Order>) {
    return this.adminService.updateOrder(id, orderId, data);
  }

  @Delete(':id/orders/:orderId')
  deleteOrder(@Param('id') id: string, @Param('orderId') orderId: string) {
    return this.adminService.deleteOrder(id, orderId);
  }

}