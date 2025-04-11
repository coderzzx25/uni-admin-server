import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

interface IRequest extends Request {
  user: any;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  private extractTokenFromHeader(request: Request): string {
    const authorization = request.headers['authorization'] as string | string[] | undefined;
    if (authorization) {
      // 如果是数组，取第一个值
      const authValue = Array.isArray(authorization) ? authorization[0] : authorization;
      const [type, token] = authValue.split(' ') || [];
      return type === 'Bearer' ? token || '' : '';
    }
    return '';
  }
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<IRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('未授权');
    }

    // 验证token
    const result = this.authService.validateTokenService(token);

    if (!result) {
      throw new UnauthorizedException('未授权');
    }

    request.user = result;

    return true;
  }
}
