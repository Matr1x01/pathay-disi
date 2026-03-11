import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { RoleRepository } from './role.repository';
import { PrismaModule } from '../../prisma/prisma.module';
import { PermissionRepository } from '../permission/permission.repository';

@Module({
  imports: [PrismaModule],
  controllers: [RoleController],
  providers: [RoleService, RoleRepository, PermissionRepository],
})
export class RoleModule {}
