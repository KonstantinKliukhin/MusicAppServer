import {
  Body,
  Controller,
  createParamDecorator,
  Get,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import CreateUserDto from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import UpdateUserDto from './dto/update-user.dto';
import { Express } from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import TokenUser from '../models/TokenUser';

export const GetTokenUser = createParamDecorator(
  (data, req): TokenUser => req.args[0].user,
);

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Creates user' })
  @ApiResponse({ status: 200, type: User })
  @Post()
  async create(@Body() userDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(userDto);
  }

  @ApiOperation({ summary: 'Creates user' })
  @ApiResponse({ status: 200, type: User })
  @Patch()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'avatar', maxCount: 1 }]))
  async update(
    @Body() userDto: UpdateUserDto,
    @UploadedFiles() files: { avatar?: Express.Multer.File } | undefined,
    @GetTokenUser() user: TokenUser,
  ): Promise<User> {
    return this.userService.updateUser(
      userDto,
      Number(user.id),
      files?.avatar?.[0],
    );
  }

  @ApiOperation({ summary: 'Returns all users' })
  @ApiResponse({ status: 200, type: [User] })
  @UseGuards(JwtAuthGuard)
  @Get('/all')
  async getAll(): Promise<User[]> {
    return await this.userService.getAllUsers();
  }

  @ApiOperation({ summary: 'Returns current user' })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(JwtAuthGuard)
  @Get()
  async me(@GetTokenUser() user: TokenUser): Promise<User> {
    return await this.userService.getOne(Number(user.id));
  }
}
