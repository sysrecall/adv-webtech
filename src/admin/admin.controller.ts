import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, UsePipes, ValidationPipe, NotFoundException , UseGuards} from '@nestjs/common';
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
import { RequiredRole } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
@Controller('admin')
export class AdminController {
  // authService: any;
  constructor(private readonly adminService: AdminService,
    private readonly authService: AuthService
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
  async signIn(@Body() AdminSignInDto: AdminSignInDto) {
    return await this.authService.signIn(AdminSignInDto.username, AdminSignInDto.password, 'admin');
  }

  //? Adminn profile endpoint
  
@UseGuards(AuthGuard, RolesGuard) // Must be in this order
@RequiredRole(Role.Admin) // This sets the required role
@Get('profile')
  async profile(@Request() request) {
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
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
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

  // @Get('age/older-than-40')
  // findOlderThan40() {
  //   return this.adminService.findOlderThan40();
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }


    //? Routes for Admin-Customer relationship (OneToMany)

  // @Post(':id/add-customer/:customerId')
  // // @UseGuards(JwtAuthGuard)
  // addCustomer(@Param('id') id: string, @Param('customerId') customerId: string) {
  //   return this.adminService.addCustomer(+id, +customerId);
  // }

  // @Delete(':id/remove-customer/:customerId')
  // // @UseGuards(JwtAuthGuard)
  // removeCustomer(@Param('id') id: string, @Param('customerId') customerId: string) {
  //   return this.adminService.removeCustomer(+id, +customerId);
  // }

  // @Get(':id/customers')
  // // @UseGuards(JwtAuthGuard)
  // getCustomers(@Param('id') id: string) {
  //   return this.adminService.getCustomers(+id);
  // }
  @Post(':id/customers')
createCustomer(
  @Param('id') id: string,
  @Body() customerData: Partial<Customer>,  // Create a DTO if needed
) {
  return this.adminService.createCustomer(+id, customerData);
}

@Patch(':id/customers/:customerId')
updateCustomer(
  @Param('id') id: string,
  @Param('customerId') customerId: string,
  @Body() updateData: Partial<Customer>,
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

}