import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TransferService } from './transfer.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { User } from 'src/user/entities/user.entity';
import { GetUser } from 'src/user/decorators/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createTransferDto: CreateTransferDto, @GetUser() user: User) {
    return this.transferService.create(createTransferDto, user);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@GetUser() user: User) {
    return this.transferService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transferService.findOne(+id);
  }
}
