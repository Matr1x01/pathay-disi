import { forwardRef, Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { RouterModule } from '@nestjs/core';
import { AdminRepository } from './admin.repository';
import { AuthModule } from '../auth/auth.module';
import { RoleRepository } from './role/role.repository'; // Import AuthModule
import { UsersModule } from './users/users.module';
import { CustomerModule } from './customer/customer.module';
import { OrderModule } from './order/order.module';
import { AdminRaiderModule } from './raider/raider.module';

@Module({
  providers: [AdminService, AdminRepository, RoleRepository],
  exports: [AdminService, AdminRepository, RoleRepository],
  controllers: [AdminController],
  imports: [
    RoleModule,
    PermissionModule,
    forwardRef(() => AuthModule), // Import AuthModule with forwardRef
    RouterModule.register([
      {
        path: '/admin',
        module: AdminModule, // self-reference is important
        children: [
          { path: 'roles', module: RoleModule },
          { path: 'users', module: UsersModule },
          { path: 'permissions', module: PermissionModule },
          { path: 'customers', module: CustomerModule },
          { path: 'orders', module: OrderModule },
          { path: 'raiders', module: AdminRaiderModule },
          // add more here later
        ],
      },
    ]),
    UsersModule,
    CustomerModule,
    OrderModule,
    AdminRaiderModule,
  ], // Export AdminService for use in other modules (e.g., AuthModule)
})
export class AdminModule {}
