import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  private extractTokenFromHeader(request: Request): string {
    const authorization = request.headers['authorization'];
    if (authorization) {
      const [type, token] = authorization.split(' ');
      return type === 'Bearer' ? token : '';
    }
    return '';
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('未授权');
    }

    // 验证token
    const result = await this.authService.validateTokenService(token);

    if (!result) {
      throw new UnauthorizedException('未授权');
    }

    request.user = result;

    return true;
  }
}
