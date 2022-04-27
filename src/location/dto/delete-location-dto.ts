import { IsNotEmpty } from 'class-validator';

export class DeleteLocationDto {
  @IsNotEmpty()
  id: string;
}
