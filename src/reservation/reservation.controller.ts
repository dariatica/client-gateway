import { Controller, Post, Body, Inject } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { NATS_SERVICE } from 'src/config/services';
import { ClientProxy } from '@nestjs/microservices';

@Controller('reservation')
export class ReservationController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.client.emit('create.reservation', createReservationDto);
  }
}
