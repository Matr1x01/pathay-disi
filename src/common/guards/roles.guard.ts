import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/role.decorator';
import { AuthRequest } from '../interfaces/auth_request.interface';
import getCommonValues from '../utils/get-common-values';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());

    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const userRoles = request.user.roles;
    return (
      getCommonValues(userRoles?.map((v) => v.name) ?? [], roles).length > 0
    );
  }
}
