import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import CreateUserDto from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as process from 'process';
import { User } from '../user/schemas/user.schema';
import SignInDto from './dto/sign-in.dto';
import AuthResponseDto from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(signInDto);

    const tokenData = await this.generateToken(user);

    return new AuthResponseDto(
      tokenData.token,
      user.id,
      user.email,
      user.avatar,
    );
  }

  async signUp(userDto: CreateUserDto): Promise<AuthResponseDto> {
    const candidate = await this.userService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPassword = await bcrypt.hash(
      userDto.password,
      Number(process.env.PASSWORD_SOLT) || 5,
    );

    const user: User = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });

    const tokenData = await this.generateToken(user);
    return new AuthResponseDto(
      tokenData.token,
      user.id,
      user.email,
      user.avatar,
    );
  }

  private async generateToken(user: User) {
    const payload = { email: user.email, id: user.id };

    return { token: this.jwtService.sign(payload) };
  }

  private async validateUser<T extends { email: string; password: string }>(
    data: T,
  ) {
    const user = await this.userService.getUserByEmail(data.email);

    if (!user)
      throw new UnauthorizedException({
        message: 'Incorrect sign in email or password',
      });

    const passwordEquals = await bcrypt.compare(data.password, user.password);

    if (passwordEquals) return user;

    throw new UnauthorizedException({
      message: 'Incorrect sign in email or password',
    });
  }
}
