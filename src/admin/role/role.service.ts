import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleRepository } from './role.repository';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { PermissionRepository } from '../permission/permission.repository';

@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly permissionRepository: PermissionRepository,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    return this.roleRepository.create(createRoleDto);
  }

  async findAll() {
    return this.roleRepository.findAll();
  }

  async findOne(id: string) {
    const role = await this.roleRepository.findOne(id);
    if (!role) {
      throw new NotFoundException(`Role with ID "${id}" not found`);
    }
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    await this.findOne(id); // check if role exists
    return this.roleRepository.update(id, updateRoleDto);
  }

  async remove(id: string) {
    await this.findOne(id); // check if role exists
    return this.roleRepository.remove(id);
  }

  async syncPermissions(
    roleId: string,
    assignPermissionDto: AssignPermissionsDto,
  ) {
    const permission = await this.permissionRepository.findByIds(
      assignPermissionDto.permissionIds,
    );

    if (!permission) {
      throw new NotFoundException(
        `One or more permissions with IDs "${assignPermissionDto.permissionIds.join(', ')}" not found`,
      );
    }

    return this.roleRepository.syncPermissions(
      roleId,
      assignPermissionDto.permissionIds,
    );
  }
}
