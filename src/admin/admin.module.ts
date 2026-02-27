import { Module, forwardRef } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { RouterModule } from '@nestjs/core';
import { AdminRepository } from './admin.repository';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule

@Module({
  providers: [AdminService, AdminRepository],
  exports: [AdminService, AdminRepository],
  controllers: [AdminController],
  imports: [
    RoleModule,
    PermissionModule,
    forwardRef(() => AuthModule), // Import AuthModule with forwardRef
    RouterModule.register([
      {
        path: 'admin',
        module: AdminModule, // self-reference is important
        children: [
          { path: 'roles', module: RoleModule },
          { path: 'permissions', module: PermissionModule },
          // add more here later
        ],
      },
    ]),
  ], // Export AdminService for use in other modules (e.g., AuthModule)
})
export class AdminModule {}
