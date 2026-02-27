import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionRepository } from './permission.repository';

@Injectable()
export class PermissionService {
  constructor(private permissionRepository: PermissionRepository) {}

  async create(createPermissionDto: CreatePermissionDto) {
    return this.permissionRepository.create(createPermissionDto);
  }

  findAll() {
    return this.permissionRepository.findAll();
  }

  async findOne(id: string) {
    const permission = await this.permissionRepository.findOne(id);
    if (!permission) {
      throw new NotFoundException(`Permission with ID "${id}" not found`);
    }
    return permission;
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    await this.findOne(id); // check if permission exists
    return this.permissionRepository.update(id, updatePermissionDto);
  }

  async remove(id: string) {
    await this.findOne(id); // check if permission exists
    return this.permissionRepository.remove(id);
  }
}
