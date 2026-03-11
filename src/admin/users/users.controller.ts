import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AdminService } from '../admin.service';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permission } from '../../common/decorators/permission.decorator';

@UseGuards(AuthGuard('jwt'), PermissionsGuard) // Protect this route with JWT authentication
@Controller('')
export class UsersController {
  constructor(private readonly adminService: AdminService) {}

  @Permission(['Create Users'])
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.adminService.create(createUserDto);
  }

  @Permission(['Edit Users'])
  @Post('sync-roles')
  syncRoles(@Body('adminId') adminId: string, @Body('roles') roles: string[]) {
    return this.adminService.syncRoles(adminId, roles);
  }

  @Permission(['View Users'])
  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 10,
    @Query('search') search: string = '',
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('direction') direction: 'asc' | 'desc' = 'asc',
    @Query('status') status?: boolean,
    @Query('roles') role?: string,
  ) {
    return this.adminService.findAll(
      page,
      perPage,
      search,
      sortBy,
      direction,
      status,
      role,
    );
  }

  @Permission(['View Users'])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @Permission(['Edit Users'])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.adminService.update(id, updateUserDto);
  }

  @Permission(['Delete Users'])
  @Delete()
  remove(@Body('id') id: string) {
    return this.adminService.remove(id);
  }
}
