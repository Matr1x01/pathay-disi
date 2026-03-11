import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUser } from '../interfaces/user.interface';
import { AuthRequest } from '../interfaces/auth_request.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IUser => {
    const request = ctx.switchToHttp().getRequest<AuthRequest>();
    return request.user; // from JwtStrategy validate
  },
);
