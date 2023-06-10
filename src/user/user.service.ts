import { HttpException, Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/sequelize';
import CreateUserDto from './dto/create-user.dto';
import UpdateUserDto from './dto/update-user.dto';
import { FileService, FileType } from '../file/file.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private UserRepository: typeof User,
    private fileService: FileService,
    private jwtService: JwtService,
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
    token: string,
    avatar?: Express.Multer.File,
  ): Promise<User> {
    if (!this.checkCurrentUser(token, id)) {
      throw new HttpException('You can not perform this user update', 403);
    }

    const user = await this.UserRepository.findOne({ where: { id } });
    user.name = data.name || user.name;

    if (avatar) {
      user.avatar = await this.fileService.createFile(FileType.IMAGE, avatar);
    }

    return await user.save();
  }

  checkCurrentUser(token: string, id: number): boolean {
    const payload = this.jwtService.decode(token) as
      | { id?: string; email?: string }
      | string;

    if (typeof payload === 'string' || !('id' in payload)) {
      throw new HttpException('Invalid token data', 400);
    }

    return id === Number(payload.id);
  }
}
