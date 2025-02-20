import { Body, Controller, Get, HttpException, Post, Res, Session, UseGuards, Req } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { ISessionTypes, ILoginData, ILoginResult, ICanActivate } from './auth.interface';
import { AuthGuard } from './auth.guard';
import { Users } from 'src/entities/users.entity';
import { Menus } from 'src/entities/menus.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  /**
   * 获取图片验证码
   */
  @Get('captcha')
  async getCaptchaAPI(@Session() session: ISessionTypes, @Res() res: Response): Promise<void> {
    // 生成验证码
    const captcha = svgCaptcha.createMathExpr({
      size: 4,
      ignoreChars: '0oO1ilI',
      noise: 2,
      width: 132,
      height: 40,
      fontSize: 40,
      color: true,
      background: '#ffffff',
    });
    session.verifyCode = captcha.text; // 保存验证码到session
    res.type('image/svg+xml'); // 返回的类型
    res.send(captcha.data);
  }

  /**
   * 账户密码登录
   * @param loginData 登录数据
   * @param session session
   * @returns 登录结果
   */
  @Post('account-login')
  async accountLoginAPI(
    @Body() loginData: ILoginData,
    @Session() session: ISessionTypes,
  ): Promise<HttpException | ILoginResult> {
    const result = await this.authService.loginSingTokenService(loginData, session);
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
