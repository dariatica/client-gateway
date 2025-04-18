import { Controller, Post, Body, Inject } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { RMQ_SERVICE } from 'src/config/services';
import { ClientProxy } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(@Inject(RMQ_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return {
      createAuthDto,
    };
  }
}
