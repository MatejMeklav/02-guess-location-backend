import { IsAlphanumeric, IsNotEmpty, IsNumber, Length } from 'class-validator';

export class CreateLocationDto {
  @IsNotEmpty()
  image: string;
  @IsNotEmpty()
  @IsNumber()
  latitude: string;
  @IsNotEmpty()
  @IsNumber()
  longtitude: string;
  @IsNotEmpty()
  @Length(5, 200)
  address: string;
}
