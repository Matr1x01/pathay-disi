import { IsEmail, IsOptional } from 'class-validator';
import { IsBangladeshPhoneNumber } from '../../common/decorator/bangladesh-phone-number.decorator';

export class UpdateUserDto {
  @IsOptional()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsBangladeshPhoneNumber()
  phone_number?: string;
}
