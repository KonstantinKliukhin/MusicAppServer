import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import CreateUserDto from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import SignInDto from './dto/sign-in.dto';
import { User } from '../user/schemas/user.schema';
import { Response } from 'express';
import userToResponse from '../helpers/hydrators/userToResponse';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Authorizes user' })
  @ApiResponse({ status: 201, type: User })
  @Post('/sign-in')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.signIn(signInDto);
    res.cookie('token', data.token, {
      httpOnly: true,
      secure: false,
      sameSite: true,
    });

    return { ...data, user: userToResponse(data.user) };
  }

  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({ status: 201, type: User })
  @Post('/sign-up')
  async signUp(@Body() userDto: CreateUserDto) {
    const data = await this.authService.signUp(userDto);

    return { ...data, user: userToResponse(data.user) };
  }
}
