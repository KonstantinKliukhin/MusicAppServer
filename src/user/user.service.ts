import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/sequelize';
import CreateUserDto from './dto/create-user.dto';
import UpdateUserDto from './dto/update-user.dto';
import { FileService, FileType } from '../file/file.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private UserRepository: typeof User,
    private fileService: FileService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    return await this.UserRepository.create(dto);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.UserRepository.findAll({
      attributes: { exclude: ['password'] },
    });
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.UserRepository.findOne({
      where: { email },
      include: { all: true },
    });
  }

  async updateUser(
    data: UpdateUserDto,
    id: number,
    avatar?: Express.Multer.File,
  ): Promise<User> {
    const user = await this.UserRepository.findOne({
      where: { id },
      attributes: { exclude: ['password'] },
    });
    user.name = data.name || user.name;

    if (avatar) {
      user.avatar = await this.fileService.createFile(FileType.IMAGE, avatar);
    }

    return await user.save();
  }

  getOne(id: number): Promise<User> {
    return this.UserRepository.findOne({
      where: { id },
      attributes: { exclude: ['password'] },
    });
  }
}
