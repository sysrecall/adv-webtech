import { Transform } from "class-transformer";
import { IsString, IsEmail, IsIn, IsNotEmpty, IsNumberString, Matches, MinLength, ValidateIf  } from "class-validator";


export class CreateAdminDto {
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Name should contain only alphabets',
  })
  fullName: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  @Matches(/@.*\.xyz$/, {
    message: 'Email must contain @ and .xyz domain',
  })
  email: string;

  @MinLength(4, {
    message: 'Password must be at least 4 characters long',
  })
  password: string;

  @IsNumberString({}, { message: 'Phone number must contain only numbers' })
  phone: string;

  @Transform(({ value }) => value.toLowerCase())
  @IsIn(['male', 'female'], {
    message: 'Gender must be either male or female',
  })
  gender: string;

  @IsNotEmpty({ message: 'NID number is required' })
  @IsString({ message: 'NID must be a string' })
  @Matches(/^\d{10,17}$/, { 
    message: 'NID number must be in valid format (10-17 digits)' 
  })
  @Transform(({ value }) => value?.trim())
  nid: string;

  
  @ValidateIf((object) => object.nidImage !== undefined)
  @Transform(({ value }) => value) 
  nidImage: Express.Multer.File;
}