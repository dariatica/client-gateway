import { Module } from '@nestjs/common';
import { ReservationModule } from './reservation/reservation.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [ReservationModule, AuthModule, CommonModule],
})
export class AppModule {}
