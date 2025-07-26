import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

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
  create(@Body() createCustomerDto: CreateCustomerDto, @UploadedFile() photo: Express.Multer.File) {
    console.log(photo.path)
    return this.customerService.create(createCustomerDto);
  }

  @Get()
  findAll() {
    return this.customerService.findAll();
  }

  @Get('photo/:name')
  getProfilePhoto(@Param('name') name: string, @Res() res) {
    res.sendFile(name, { root: './uploads/customer/profile-photos'})        
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customerService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(+id);
  }
}
