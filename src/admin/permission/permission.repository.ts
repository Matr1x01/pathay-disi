import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPermissionDto: CreatePermissionDto) {
    return this.prisma.permission.create({
      data: createPermissionDto,
    });
  }

  async findAll() {
    return this.prisma.permission.findMany();
  }

  async findByIds(ids: string[]) {
    return this.prisma.permission.findMany({
      where: { id: { in: ids } },
    });
  }

  async findOne(id: string) {
    return this.prisma.permission.findUnique({
      where: { id },
    });
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    return this.prisma.permission.update({
      where: { id },
      data: updatePermissionDto,
    });
  }

  async remove(id: string) {
    return this.prisma.permission.delete({ where: { id } });
  }
}
