import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { Match } from 'src/common/decorator/match.decorator';
import { IsBangladeshPhoneNumber } from '../../common/decorator/bangladesh-phone-number.decorator';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(6, 20)
  password: string;

  @IsNotEmpty()
  @Length(6, 20)
  @Match('password', { message: 'Passwords do not match' })
  confirm_password: string;

  @IsOptional()
  @IsBangladeshPhoneNumber()
  phone_number?: string;
}
