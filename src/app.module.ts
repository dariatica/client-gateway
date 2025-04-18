import { Module } from '@nestjs/common';
import { ReservationModule } from './reservation/reservation.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ReservationModule, AuthModule],
})
export class AppModule {}
