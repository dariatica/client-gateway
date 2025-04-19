import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { RMQ_SERVICE } from 'src/config/services';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(RMQ_SERVICE) private readonly client: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    const { token: newToken, user } = await firstValueFrom<{
      user: { id: string };
      token: string;
    }>(this.client.send({ cmd: 'verifyToken' }, token));
    try {
      request['user'] = user;

      request['token'] = newToken;
    } catch {
      throw new UnauthorizedException('Token not found');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
