import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateTransferDto {
  @IsNotEmpty()
  @IsNumber()
  senderId: number;

  @IsNotEmpty()
  @IsNumber()
  receiverId: number;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
