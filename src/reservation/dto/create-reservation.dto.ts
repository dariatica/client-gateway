import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  name: string;
  @IsDate()
  @Type(() => Date)
  appointment: Date;
  @IsString()
  email: string;
}
