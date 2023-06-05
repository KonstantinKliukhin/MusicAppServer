import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import CreateUserDto from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';

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

  @ApiOperation({ summary: 'Returns all users' })
  @ApiResponse({ status: 200, type: [User] })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(): Promise<User[]> {
    return await this.userService.getAllUsers();
  }
}
