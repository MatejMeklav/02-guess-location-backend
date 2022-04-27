import { IsAlphanumeric, IsNotEmpty, IsNumber, Length } from 'class-validator';

export class CreateLocationDto {
  @IsNotEmpty()
  image: Uint8Array;
  @IsNotEmpty()
  @IsNumber()
  latitude: string;
  @IsNotEmpty()
  @IsNumber()
  longtitude: string;
  @IsNotEmpty()
  @IsAlphanumeric()
  @Length(5, 40)
  address: string;
}
