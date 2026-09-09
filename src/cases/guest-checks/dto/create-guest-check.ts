import { IsUUID } from 'class-validator';

export class CreateGuestCheckDto {
  @IsUUID()
  spotId: string;
}
