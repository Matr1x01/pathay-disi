import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { paginate } from '../../common/utils/prisma-pagination';

@Injectable()
export class RoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    const role = await this.prisma.role.create({
      data: {
        name: createRoleDto.name,
        description: createRoleDto.description,
        status: createRoleDto.status,
      },
    });

    if (createRoleDto.permissions && createRoleDto.permissions.length > 0) {
      await this.syncPermissions(role.id, createRoleDto.permissions);
    }

    return role;
  }

  async findAll(
    page: number = 1,
    perPage: number = 10,
    search?: string,
    sortBy?: string,
    direction: 'asc' | 'desc' = 'asc',
    status?: string,
  ) {
    const where = {
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
      ...(status && { status: { equals: status == 'true' } }),
    };

    const include = {
      permissions: {
        include: {
          permission: true,
        },
      },
    };

    return paginate(
      this.prisma.role,
      { page, perPage },
      {
        where,
        include,
        orderBy: sortBy ? { [sortBy]: direction } : undefined,
      },
    );
  }

  async findByIds(ids: string[]) {
    return this.prisma.role.findMany({
      where: { id: { in: ids } },
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
    const role = this.prisma.role.update({
      where: { id },
      data: {
        name: updateRoleDto.name,
        description: updateRoleDto.description,
        status: updateRoleDto.status,
      },
    });

    if (updateRoleDto.permissions) {
      await this.syncPermissions(id, updateRoleDto.permissions);
    }

    return role;
  }

  async remove(id: string) {
    const r = this.prisma.role.delete({ where: { id } });
    return r;
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
