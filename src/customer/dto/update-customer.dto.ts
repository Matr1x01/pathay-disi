import { IsEmail, IsOptional } from 'class-validator';
import { IsBangladeshPhoneNumber } from '../../common/decorators/bangladesh-phone-number.decorator';

export class UpdateCustomerDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsBangladeshPhoneNumber()
  phone_number?: string;
}
