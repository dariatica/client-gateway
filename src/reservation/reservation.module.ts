import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RMQ_SERVICE } from 'src/config/services';
import { envs } from 'src/config/envs';

@Module({
  controllers: [ReservationController],
  imports: [
    ClientsModule.register([
      {
        name: RMQ_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: envs.rmq_servers,
          queue: 'reservations',
        },
      },
    ]),
  ],
})
export class ReservationModule {}
