import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    try {
      const token = this.getToken(req);

      if (!token) {
        throw new UnauthorizedException('User is unauthorized');
      }

      const user = this.jwtService.verify(token);

      req.user = user;

      return true;
    } catch (e) {
      throw new UnauthorizedException('User is unauthorized');
    }
  }

  private getToken(req: any) {
    return this.getTokenFromCookies(req) || this.getTokenFromAuthHeader(req);
  }

  private getTokenFromCookies(req: any): string | undefined {
    return req.cookies.token;
  }

  private getTokenFromAuthHeader(req: any): string | undefined {
    const authHeader = req.headers.authorization;
    const bearer = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];

    if (bearer?.toLowerCase() !== 'bearer') return;

    return token;
  }
}
