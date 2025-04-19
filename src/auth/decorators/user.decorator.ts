import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';

interface ExtendRequest extends Request {
  user: {
    id: string;
  };
}

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<ExtendRequest>();

    if (!request.user)
      throw new InternalServerErrorException('User not found in request');
    return request.user;
  },
);
