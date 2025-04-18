import {
  Controller,
  Post,
  Body,
  Inject,
  Get,
  Param,
  ParseUUIDPipe,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { RMQ_SERVICE } from 'src/config/services';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, throwError, timeout } from 'rxjs';

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
    return this.client.send({ cmd: 'get.reservations' }, {}).pipe(
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        throw new RpcException(err);
      }),
    );
  }

  @Get(':id')
  findOneReservation(@Param('id', ParseUUIDPipe) id: string) {
    // console.log(id);
    return this.client.send({ cmd: 'get.one.reservations' }, { id }).pipe(
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        throw new RpcException(err);
      }),
    );
  }
}
