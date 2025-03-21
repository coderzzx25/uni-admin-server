import { Body, Controller, Get, HttpException, Post, UseGuards, Req } from '@nestjs/common';

import { AuthService } from './auth.service';
import { ILoginData, ILoginResult, ICanActivate } from './auth.interface';
import { AuthGuard } from './auth.guard';
import { Users } from 'src/entities/users.entity';
import { Menus } from 'src/entities/menus.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 账户密码登录
   * @param loginData 登录数据
   * @param session session
   * @returns 登录结果
   */
  @Post('account-login')
  async accountLoginAPI(@Body() loginData: ILoginData): Promise<HttpException | ILoginResult> {
    const result = await this.authService.loginSingTokenService(loginData);
    return result;
  }

  /**
   * 刷新token
   * @param req 请求
   * @returns 刷新结果
   */
  @UseGuards(AuthGuard)
  @Get('refresh-token')
  async refreshTokenAPI(@Req() req: ICanActivate): Promise<HttpException | ILoginResult> {
    const { id } = req.user;
    const result = await this.authService.refreshTokenService(id);
    return result;
  }

  /**
   * 获取用户信息
   * @param req 请求
   * @returns 用户信息
   */
  @UseGuards(AuthGuard)
  @Get('user-info')
  async getUserInfoAPI(@Req() req: ICanActivate): Promise<HttpException | Users> {
    const { id } = req.user;
    const result = await this.authService.getUserInfo(id);
    return result;
  }

  /**
   * 获取用户菜单权限
   * @param req 请求体
   * @returns 用户菜单权限
   */
  @UseGuards(AuthGuard)
  @Get('user-menu')
  async getUserMenuAPI(@Req() req: ICanActivate): Promise<HttpException | Menus[]> {
    const { roleId } = req.user;
    const result = await this.authService.getUserMenuService(roleId);
    return result;
  }
}
