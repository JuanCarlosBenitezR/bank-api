import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import e from 'express';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interfaces';
import { GetUser } from './decorators/get-user.decorator';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private readonly jwtservice: JwtService,
  ) {}
  async register(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    try {
      const newUser = await this.userModel.create({
        name: name,
        email: email,
        password: bcrypt.hashSync(password, 12),
        account_number: this.generateAccountNumber(),
        balance: 0.0,
      });
      return {
        message: 'User registered successfully',
        user: {
          id: newUser.dataValues.id,
          name: newUser.dataValues.name,
          email: newUser.dataValues.email,
          account_number: newUser.dataValues.account_number,
          balance: newUser.dataValues.balance,
        },
      };
    } catch (error) {
      throw new Error('Error registering user: ' + error.message);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userModel.findOne({
      where: {
        email: email,
      },
    });
    if (!user || !bcrypt.compareSync(password, user.dataValues.password)) {
      throw new BadRequestException('Invalid credentials');
    }
    return {
      token: this.getJwtToken({ id: user.dataValues.id }),
      message: 'Login successful',
      user: {
        id: user.dataValues.id,
        name: user.dataValues.name,
        email: user.dataValues.email,
        account_number: user.dataValues.account_number,
        balance: user.dataValues.balance,
      },
    };
  }

  findUserAuthenticated(user: User) {
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      account_number: user.account_number,
      balance: user.balance,
    };
  }

  generateAccountNumber() {
    console.log('Generating account number...');
    const timestamp = Date.now().toString().slice(-8);
    const randomDigits = Math.floor(100000 + Math.random() * 900000).toString();
    return timestamp + randomDigits;
  }

  findOne(id: string) {
    const user = this.userModel.findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async updateBalance(user: User, amount: number) {
    try {
      console.log('user balance before update', user.dataValues.balance);
      console.log('amount to update', amount);
      const updatedUser = await this.userModel.update(
        { balance: user.dataValues.balance - amount },
        { where: { id: user.dataValues.id }, returning: true },
      );
      return updatedUser[1][0];
    } catch (error) {
      this.handleDBException(error);
    }
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtservice.sign(payload);
  }

  private handleDBException(error: any) {
    console.log(error);
    if (error.parent?.code === '23505') {
      throw new BadRequestException(error.parent.detail);
    }
  }
}
