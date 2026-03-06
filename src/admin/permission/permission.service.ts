import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionRepository } from './permission.repository';
import {
  serialize,
  serializePaginated,
} from '../../common/utils/serialize.util';
import { PermissionResponseDto } from './dto/permission-response.dto';

@Injectable()
export class PermissionService {
  constructor(private permissionRepository: PermissionRepository) {}

  create(createPermissionDto: CreatePermissionDto) {
    return serialize(
      PermissionResponseDto,
      this.permissionRepository.create(createPermissionDto),
    );
  }

  async findAll(page: number = 1, perPage: number = 10, search?: string) {
    const roles = await this.permissionRepository.findAll(
      page,
      perPage,
      search,
    );
    return serializePaginated(PermissionResponseDto, roles);
  }

  async findOne(id: string) {
    const permission = await this.permissionRepository.findOne(id);
    if (!permission) {
      throw new NotFoundException(`Permission with ID "${id}" not found`);
    }
    return serialize(PermissionResponseDto, permission);
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    await this.findOne(id); // check if permission exists
    return serialize(
      PermissionResponseDto,
      this.permissionRepository.update(id, updatePermissionDto),
    );
  }

  async remove(id: string) {
    await this.findOne(id); // check if permission exists
    return this.permissionRepository.remove(id);
  }
}
