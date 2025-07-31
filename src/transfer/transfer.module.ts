import { Module } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Transfer } from './entities/transfer.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [TransferController],
  providers: [TransferService],
  imports: [SequelizeModule.forFeature([Transfer]), UserModule],
})
export class TransferModule {}
