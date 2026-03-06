import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { AdminService } from '../admin.service';
import { AdminRepository } from '../admin.repository';
import { RoleRepository } from '../role/role.repository';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => AuthModule), // Import AuthModule with forwardRef
  ],
  controllers: [UsersController],
  providers: [AdminService, AdminRepository, RoleRepository],
  exports: [AdminService, AdminRepository, RoleRepository],
})
export class UsersModule {}
