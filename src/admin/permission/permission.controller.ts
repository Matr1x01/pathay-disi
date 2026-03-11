import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { AuthGuard } from '@nestjs/passport';
import { Permission } from '../../common/decorators/permission.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Permission(['Create Permissions'])
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Permission(['View Permissions'])
  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 10,
    @Query('search') search?: string,
  ) {
    return this.permissionService.findAll(page, perPage, search);
  }

  @Permission(['View Permissions'])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(id);
  }

  @Permission(['Edit Permissions'])
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(id, updatePermissionDto);
  }

  @Permission(['Delete Permissions'])
  @Delete('')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Body() { id }: { id: string }) {
    return this.permissionService.remove(id);
  }
}
