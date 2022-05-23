import { IsAlpha, IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateUserInformationDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @MaxLength(15)
  @IsAlpha()
  firstName: string;
  @IsNotEmpty()
  @MaxLength(15)
  @IsAlpha()
  lastName: string;
}
