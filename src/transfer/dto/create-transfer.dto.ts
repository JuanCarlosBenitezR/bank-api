import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateTransferDto {
  @IsNotEmpty()
  @IsString()
  senderId: string;

  @IsNotEmpty()
  @IsString()
  receiverId: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
