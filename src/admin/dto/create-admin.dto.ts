import { Transform } from "class-transformer";
import { IsString, IsEmail, IsIn, IsNotEmpty, IsNumberString, Matches, MinLength, ValidateIf, IsInt, MaxLength, Min, IsOptional  } from "class-validator";


export class CreateAdminDto {
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @Min(0)
  id: number;

  @IsString()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Name should contain only alphabets',
  })
  @MaxLength(100)
  fullName: string;

  @IsInt()
  @Min(0)
  @Transform(({ value }) => parseInt(value, 10))
  age: number

  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: string; // Keep optional, but validation will pass if omitted
  
  @IsString()
  username: string;

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