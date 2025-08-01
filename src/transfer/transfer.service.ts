import { Injectable } from '@nestjs/common';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { User } from 'src/user/entities/user.entity';
import { Transfer } from './entities/transfer.entity';
import { InjectModel } from '@nestjs/sequelize';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TransferService {
  constructor(
    @InjectModel(Transfer)
    private transferModel: typeof Transfer,

    private readonly userService: UserService,
  ) {}
  async create(createTransferDto: CreateTransferDto, user: User) {
    const { receiverId, amount } = createTransferDto;
    try {
      console.log('receiverId', receiverId);
      console.log('amount', amount);
      const receiver = await this.userService.findOne(receiverId);
      if (!receiver) {
        throw new Error('Receiver not found');
      }
      console.log('receiver', receiver);
      console.log('userId', user.id);
      if (amount <= 0) {
        throw new Error('Amount must be greater than zero');
      }
      console.log('user balance', user.dataValues.balance);
      if (user.dataValues.balance < amount) {
        throw new Error('Insufficient balance');
      }
      const transfer = await this.transferModel.create({
        senderId: user.id,
        receiverId: receiverId,
        amount: amount,
      });

      const updatedSender = await this.userService.updateBalance(user, amount);
      const updatedReceiver = await this.userService.updateBalance(
        receiver,
        -amount,
      );

      return {
        message: 'Transfer created successfully',
        transfer: {
          id: transfer.dataValues.id,
          senderId: transfer.dataValues.senderId,
          receiverAccount: transfer.dataValues.receiverAccount,
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
