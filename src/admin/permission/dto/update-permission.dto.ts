import { PartialType } from '@nestjs/mapped-types';
import { CreatePermissionDto } from './create-permission.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { Optional } from '@nestjs/common';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  @IsNotEmpty()
  @IsString()
  name: string;

  @Optional()
  @IsString()
  description?: string;
}
