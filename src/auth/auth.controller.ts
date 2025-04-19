import { Controller, Post, Body, Inject, HttpStatus } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { RMQ_SERVICE } from 'src/config/services';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, throwError, timeout } from 'rxjs';
import { CredentialsUser } from './dto/credentialUser.dto';

@Controller('auth')
export class AuthController {
  constructor(@Inject(RMQ_SERVICE) private readonly client: ClientProxy) {}

  @Post('register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.client.send({ cmd: 'createAuth' }, createAuthDto).pipe(
      timeout({
        each: 4000,
        with: () =>
          throwError(() => {
            throw new RpcException({
              status: HttpStatus.BAD_GATEWAY,
              message: 'Time Out response',
            });
          }),
      }),
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Post('login')
  login(@Body() credentialUser: CredentialsUser) {
    return this.client.send({ cmd: 'getUser' }, credentialUser).pipe(
      timeout({
        each: 4000,
        with: () =>
          throwError(() => {
            throw new RpcException({
              status: HttpStatus.BAD_GATEWAY,
              message: 'Time Out response',
            });
          }),
      }),
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
