import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsBangladeshPhoneNumber } from '../../../common/decorators/bangladesh-phone-number.decorator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  @IsBangladeshPhoneNumber()
  phone: string;

  @IsOptional()
  status: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles: string[];
}
