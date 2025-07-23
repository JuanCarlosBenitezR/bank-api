import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  register(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }
  login(loginUserDto: LoginUserDto) {
    return 'This action logs in a user';
  }

  findUserAuthenticated() {
    return `This action returns the authenticated user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
}
