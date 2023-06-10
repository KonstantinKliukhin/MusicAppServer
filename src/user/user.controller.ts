import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
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
import { Express, Request } from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

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
  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'avatar', maxCount: 1 }]))
  async update(
    @Param('id') id: string,
    @Body() userDto: UpdateUserDto,
    @UploadedFiles() files: { avatar?: Express.Multer.File } | undefined,
    @Req() req: Request,
  ): Promise<User> {
    return this.userService.updateUser(
      userDto,
      Number(id),
      req.cookies.token,
      files?.avatar?.[0],
    );
  }

  @ApiOperation({ summary: 'Returns all users' })
  @ApiResponse({ status: 200, type: [User] })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(): Promise<User[]> {
    return await this.userService.getAllUsers();
  }
}
