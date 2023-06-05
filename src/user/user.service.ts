import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/sequelize';
import CreateUserDto from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private UserRepository: typeof User) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    return await this.UserRepository.create(dto);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.UserRepository.findAll();
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.UserRepository.findOne({
      where: { email },
      include: { all: true },
    });
  }
}
