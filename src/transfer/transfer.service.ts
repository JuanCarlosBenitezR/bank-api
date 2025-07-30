import { Injectable } from '@nestjs/common';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { User } from 'src/user/entities/user.entity';
import { Transfer } from './entities/transfer.entity';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class TransferService {
  constructor(
    @InjectModel(Transfer)
    private transferModel: typeof Transfer,
  ) {}
  async create(createTransferDto: CreateTransferDto, user: User) {
    const { senderId, receiverId, amount } = createTransferDto;
    try {
      const transfer = await this.transferModel.create({
        senderId: senderId,
        receiverId: receiverId,
        amount: amount,
      });
      return {
        message: 'Transfer created successfully',
        transfer: {
          id: transfer.dataValues.id,
          senderId: transfer.dataValues.senderId,
          receiverId: transfer.dataValues.receiverId,
          amount: transfer.dataValues.amount,
        },
      };
    } catch (error) {
      throw new Error('Error creating transfer: ' + error.message);
    }
  }

  findAll(user: User) {
    return this.transferModel.findAll({
      where: {
        senderId: user.id,
      },
    });
  }

  findOne(id: number) {
    return this.transferModel.findOne({
      where: {
        id: id,
      },
    });
  }
}
