import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    return this.prisma.role.create({
      data: {
        name: createRoleDto.name,
        description: createRoleDto.description,
      },
    });
  }

  async findAll() {
    return this.prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    return this.prisma.role.update({
      where: { id },
      data: {
        name: updateRoleDto.name,
        description: updateRoleDto.description,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.role.delete({ where: { id } });
  }

  async syncPermissions(roleId: string, permissionIds: string[]) {
    // Remove existing permissions
    await this.prisma.rolePermission.deleteMany({
      where: { roleId },
    });

    // Add new permissions
    const rolePermissions = permissionIds.map((permissionId) => ({
      roleId,
      permissionId,
    }));

    return this.prisma.rolePermission.createMany({
      data: rolePermissions,
    });
  }
}
