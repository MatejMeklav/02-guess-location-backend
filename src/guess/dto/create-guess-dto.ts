import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateGuessDto {
  @IsNotEmpty()
  latitude: number;
  @IsNotEmpty()
  @IsNumber()
  longtitude: number;
  @IsNotEmpty()
  @IsNumber()
  meters: number;
  @IsNotEmpty()
  locationId: string;
}
