import {
  Controller,
  Post,
  Body,
  Inject,
  HttpStatus,
  Get,
  UseGuards,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { RMQ_SERVICE } from 'src/config/services';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, throwError, timeout } from 'rxjs';
import { CredentialsUser } from './dto/credentialUser.dto';
import { AuthGuard } from './guards/auth.guard';
import { User } from './decorators/user.decorator';
import { Token } from './decorators/token.decorator';

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

  // @Req() req: Express

  @UseGuards(AuthGuard)
  @Get('verify')
  verifyToken(@User() user: { id: string }, @Token() token: string) {
    // const user = req['user'] as { id: string };
    // const token = req['token'] as string;
    return {
      user,
      token,
    };

    // return this.client.send({ cmd: 'verifyToken' }, {}).pipe(
    //   timeout({
    //     each: 4000,
    //     with: () =>
    //       throwError(() => {
    //         throw new RpcException({
    //           status: HttpStatus.BAD_GATEWAY,
    //           message: 'Time Out response',
    //         });
    //       }),
    //   }),
    //   catchError((err) => {
    //     throw new RpcException(err);
    //   }),
    // );
  }
}
