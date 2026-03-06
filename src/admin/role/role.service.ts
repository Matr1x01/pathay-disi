import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleRepository } from './role.repository';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { PermissionRepository } from '../permission/permission.repository';
import { RoleResponseDto } from './dto/role-response.dto';
import {
  serialize,
  serializePaginated,
} from '../../common/utils/serialize.util';

@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly permissionRepository: PermissionRepository,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    await this.validatePermissions(createRoleDto.permissions ?? []);
    return serialize(
      RoleResponseDto,
      this.roleRepository.create(createRoleDto),
    );
  }

  async findAll(
    page: number = 1,
    perPage: number = 10,
    search?: string,
    sortBy?: string,
    direction: 'asc' | 'desc' = 'asc',
    status?: string,
  ) {
    const roles = await this.roleRepository.findAll(
      page,
      perPage,
      search,
      sortBy,
      direction,
      status,
    );

    return serializePaginated(RoleResponseDto, roles);
  }

  async findOne(id: string) {
    const role = await this.roleRepository.findOne(id);
    if (!role) {
      throw new NotFoundException(`Role with ID "${id}" not found`);
    }
    return serialize(RoleResponseDto, role);
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    await this.findOne(id); // check if role exists

    await this.validatePermissions(updateRoleDto.permissions ?? []);

    return serialize(
      RoleResponseDto,
      this.roleRepository.update(id, updateRoleDto),
    );
  }

  async remove(id: string) {
    await this.findOne(id); // check if role exists
    return this.roleRepository.remove(id);
  }

  async syncPermissions(
    roleId: string,
    assignPermissionDto: AssignPermissionsDto,
  ) {
    await this.validatePermissions(assignPermissionDto.permissionIds);

    return this.roleRepository.syncPermissions(
      roleId,
      assignPermissionDto.permissionIds,
    );
  }

  private async validatePermissions(permissionIds: string[]) {
    const permission = await this.permissionRepository.findByIds(permissionIds);

    if (permission.length !== permissionIds.length) {
      throw new NotFoundException(
        `One or more permissions with IDs "${permissionIds.join(', ')}" not found`,
      );
    }
  }
}
