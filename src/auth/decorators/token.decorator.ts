import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';

interface ExtendRequest extends Request {
  token: string;
}

export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<ExtendRequest>();

    if (!request.token)
      throw new InternalServerErrorException('Token not found in request');
    return request.token;
  },
);
