import { IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateUserPasswordDto {
  @IsNotEmpty()
  @MaxLength(20)
  password: string;
  @IsNotEmpty()
  @MaxLength(20)
  repeatedPassword: string;
  @IsNotEmpty()
  @MaxLength(20)
  oldPassword: string;
}
