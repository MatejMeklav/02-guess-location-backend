import { IsNotEmpty } from 'class-validator';

export class EditLocationDto {
  @IsNotEmpty()
  id: string;
  @IsNotEmpty()
  image: string;
}
