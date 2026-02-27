import { IsNotEmpty, IsString } from 'class-validator';
import { Optional } from '@nestjs/common';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @Optional()
  description?: string;
}
