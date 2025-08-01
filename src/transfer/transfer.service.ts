import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { User } from 'src/user/entities/user.entity';
import { Transfer } from './entities/transfer.entity';
import { InjectModel } from '@nestjs/sequelize';
import { UserService } from 'src/user/user.service';
import { NotFoundError } from 'rxjs';

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
      const receiver = await this.userService.findOne(receiverId);
      if (!receiver) {
        throw new NotFoundException('Receiver not found');
      }
      if (amount <= 0) {
        throw new Error('Amount must be greater than zero');
      }
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

  async findOne(id: number, user: User) {
    const transfer = await this.transferModel.findOne({
      where: {
        id: id,
      },
    });
    if (!transfer) {
      throw new NotFoundException(`Transfer with ID ${id} not found`);
    }
    if (
      transfer.dataValues.senderId === user.dataValues.id ||
      transfer.dataValues.receiverId === user.dataValues.id
    ) {
      return transfer;
    }
    throw new ForbiddenException('Transfer not found for this user');
  }
}
