import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RMQ_SERVICE } from 'src/config/services';
import { envs } from 'src/config/envs';

@Module({
  controllers: [AuthController],
  imports: [
    ClientsModule.register([
      {
        name: RMQ_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: envs.rmq_servers,
          queue: 'auth',
        },
      },
    ]),
  ],
})
export class AuthModule {}
