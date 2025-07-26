import { Module } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Transfer } from './entities/transfer.entity';

@Module({
  controllers: [TransferController],
  providers: [TransferService],
  imports: [SequelizeModule.forFeature([Transfer])],
})
export class TransferModule {}
