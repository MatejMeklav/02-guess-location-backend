import { IsAlpha, IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateUserImageDto {
  @IsNotEmpty()
  image: string;
}
