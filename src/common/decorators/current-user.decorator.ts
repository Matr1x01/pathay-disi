import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { IUser } from '../interfaces/user.interface';

export interface AuthRequest extends Request {
  user: IUser;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IUser => {
    const request = ctx.switchToHttp().getRequest<AuthRequest>();
    return request.user; // from JwtStrategy validate
  },
);
