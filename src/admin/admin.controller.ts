import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, UsePipes, ValidationPipe } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

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
    storage: diskStorage({
      destination: './uploads/admin/nid',
      filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
      }
    }) 
  }))
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createAdminDto: CreateAdminDto, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('NID image is required and must be under 2MB');
    }
    createAdminDto.nidImage = file;
    console.log(file.path)

    return this.adminService.create(createAdminDto);
  }

  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}