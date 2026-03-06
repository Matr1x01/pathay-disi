import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { paginate } from '../common/utils/prisma-pagination';

@Injectable()
export class AdminRepository {
  constructor(protected prisma: PrismaService) {}

  async getActiveByEmail(email: string) {
    return this.prisma.admin.findFirst({
      where: { email, isActive: true },
    });
  }

  async findById(id: string, withRoles = false, withPermissions = false) {
    return this.prisma.admin.findFirst({
      where: { id },
      include: {
        roles: withRoles
          ? {
              include: {
                role: withPermissions
                  ? {
                      include: {
                        permissions: {
                          include: {
                            permission: true,
                          },
                        },
                      },
                    }
                  : true,
              },
            }
          : false,
      },
    });
  }

  async updateRoles(adminId: string, roleIds: string[]) {
    // First, remove existing roles
    await this.prisma.adminRole.deleteMany({
      where: { adminId },
    });

    // Then, add new roles
    const newRoles = roleIds.map((roleId) => ({
      adminId,
      roleId,
    }));

    await this.prisma.adminRole.createMany({
      data: newRoles,
    });
  }

  create(createUser: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    status?: boolean;
  }) {
    return this.prisma.admin.create({
      data: {
        name: createUser.name,
        email: createUser.email,
        password: createUser.password,
        phone: createUser.phone ?? '',
        isActive: createUser.status ?? true,
      },
    });
  }

  findAll(
    page: number,
    perPage: number,
    search: string,
    sortBy: string,
    direction: 'asc' | 'desc',
    status?: boolean,
    roles?: string[],
  ) {
    return paginate(
      this.prisma.admin,
      { page, perPage },
      {
        where: {
          AND: [
            {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
              ],
            },
            status !== undefined ? { isActive: status } : {},
            roles && roles.length > 0
              ? {
                  roles: {
                    some: {
                      role: {
                        id: { in: roles },
                      },
                    },
                  },
                }
              : {},
          ],
        },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      },
    );
  }

  remove(id: string) {
    return this.prisma.admin.delete({
      where: { id },
    });
  }

  update(
    id: string,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      isActive?: boolean;
      password?: string;
    },
  ) {
    return this.prisma.admin.update({
      where: { id },
      data,
    });
  }
}
