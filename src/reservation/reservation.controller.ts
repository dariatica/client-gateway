import {
  Controller,
  Post,
  Body,
  Inject,
  Get,
  Param,
  ParseUUIDPipe,
  Logger,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { RMQ_SERVICE } from 'src/config/services';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';

@Controller('reservation')
export class ReservationController {
  private readonly logger = new Logger('ReservationController');
  constructor(@Inject(RMQ_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.client.emit('create.reservation', createReservationDto);
  }

  @Get()
  findAllReservations() {
    return this.client.send({ cmd: 'get.reservations' }, {});
  }

  @Get(':id')
  findOneReservation(@Param('id', ParseUUIDPipe) id: string) {
    // console.log(id);
    return this.client.send({ cmd: 'get.one.reservations' }, { id }).pipe(
      catchError((err) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        throw new RpcException(err);
      }),
    );
  }
}
