import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthRequest } from '../interfaces/auth_request.interface';
import getCommonValues from '../utils/get-common-values';
import { Permission } from '../decorators/permission.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permissions = this.reflector.get(Permission, context.getHandler());

    if (!permissions) {
      return true;
    }
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const userPermissions = request.user.permissions;
    return (
      getCommonValues(userPermissions?.map((v) => v.name) ?? [], permissions)
        .length > 0
    );
  }
}
