import { PartialType } from '@nestjs/mapped-types';
import { CreateRaiderDto } from './create-raider.dto';

export class UpdateRaiderDto extends PartialType(CreateRaiderDto) {}
