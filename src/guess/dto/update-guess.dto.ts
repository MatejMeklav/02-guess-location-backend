import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateGuessDto {
  @IsNotEmpty()
  latitude: number;
  @IsNotEmpty()
  @IsNumber()
  longtitude: number;
  @IsNotEmpty()
  @IsNumber()
  meters: number;
}
