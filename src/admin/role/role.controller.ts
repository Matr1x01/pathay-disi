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
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permission } from '../../common/decorators/permission.decorator';

@UseGuards(AuthGuard('jwt'), PermissionsGuard) // Protect this route with JWT authentication
@Controller('')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Permission(['Create Roles'])
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Permission(['View Roles'])
  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 10,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('direction') direction: 'asc' | 'desc' = 'asc',
    @Query('status') status?: string,
  ) {
    return this.roleService.findAll(
      page,
      perPage,
      search,
      sortBy,
      direction,
      status,
    );
  }

  @Permission(['View Roles'])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Permission(['Edit Roles'])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(['Create Roles'])
  @Delete('')
  remove(@Body() { id }: { id: string }) {
    return this.roleService.remove(id);
  }

  @Permission(['Edit Roles'])
  @Post(':roleId/permissions')
  @HttpCode(HttpStatus.CREATED)
  syncPermissions(
    @Param('roleId') roleId: string,
    @Body() assignPermissionsDto: AssignPermissionsDto,
  ) {
    return this.roleService.syncPermissions(roleId, assignPermissionsDto);
  }
}
