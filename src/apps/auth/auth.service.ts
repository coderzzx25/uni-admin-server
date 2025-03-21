import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { Users } from 'src/entities/users.entity';
import { ILoginResult, ILoginData } from './auth.interface';
import { UserService } from '../user/user.service';
import { MenuService } from '../menu/menu.service';
import { PermissionService } from '../permission/permission.service';
import { initializeTree } from 'src/utils';
import { Menus } from 'src/entities/menus.entity';

@Injectable()
export class AuthService {
  private readonly saltRounds = 10; // 加密强度

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly permissionService: PermissionService,
    private readonly menuService: MenuService,
  ) {}

  /**
   * 密码加密
   * @param password 密码
   * @returns 加密后的密码
   */
  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  /**
   * 密码比对
   * @param plainText 明文密码
   * @param encrypted 密文密码
   * @returns 是否一致
   */
  private async comparePassword(plainText: string, encrypted: string): Promise<boolean> {
    return await bcrypt.compare(plainText, encrypted);
  }

  /**
   * 登录信息校验
   * @param loginData 登录信息
   * @param session session
   * @returns 用户信息
   * @throws HttpException
   */
  private async validateUser(loginData: ILoginData): Promise<HttpException | Users> {
    const { username, password } = loginData;
    // 用户名密码校验
    if (!username && !password) {
      return new HttpException('用户名和密码不能为空', HttpStatus.BAD_REQUEST);
    }

    // 查询用户信息
    const where = { username, status: 1 };

    const userInfo = await this.userService.getUserInfo(where);

    if (userInfo instanceof HttpException) {
      throw userInfo;
    }

    if (!userInfo) {
      return new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    // 密码校验
    const isPasswordValid = await this.comparePassword(password, userInfo.password);

    if (!isPasswordValid) {
      return new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }

    // 返回用户信息
    return userInfo;
  }

  /**
   * 登录
   * @param loginData 登录信息
   * @param session session
   * @returns 用户信息
   * @throws HttpException
   */
  async loginSingTokenService(loginData: ILoginData): Promise<HttpException | ILoginResult> {
    const authResult = await this.validateUser(loginData);

    if (authResult instanceof HttpException) {
      throw authResult;
    }

    // 生成token
    const token = this.jwtService.sign(
      { username: authResult.username, id: authResult.id, roleId: authResult.roleId },
      { secret: this.configService.get('JWT_SECRET'), expiresIn: this.configService.get('JWT_EXPIRES_IN') },
    );
    const refreshToken = this.jwtService.sign(
      { username: authResult.username, id: authResult.id, roleId: authResult.roleId },
      { secret: this.configService.get('JWT_SECRET'), expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') },
    );
    const currentUserInfo = {
      id: authResult.id,
      token,
      refreshToken,
    };

    return currentUserInfo;
  }

  /**
   * 验证token
   * @param token token
   * @returns 是否有效
   */
  async validateTokenService(token: string): Promise<ILoginResult | null> {
    try {
      const result = this.jwtService.verify(token, { secret: this.configService.get('JWT_SECRET') });
      return result;
    } catch (e) {
      return null;
    }
  }

  /**
   * 刷新token
   * @param userId 用户ID
   * @returns 刷新结果
   */
  async refreshTokenService(userId: number): Promise<HttpException | ILoginResult> {
    const result = await this.getUserInfo(userId);
    if (result instanceof HttpException) {
      throw result;
    }
    const token = this.jwtService.sign(
      { username: result.username, id: result.id, roleId: result.roleId },
      { secret: this.configService.get('JWT_SECRET'), expiresIn: this.configService.get('JWT_EXPIRES_IN') },
    );
    const refreshToken = this.jwtService.sign(
      { username: result.username, id: result.id, roleId: result.roleId },
      { secret: this.configService.get('JWT_SECRET'), expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') },
    );

    return { id: result.id, token, refreshToken };
  }

  /**
   * 获取用户信息
   * @param id 用户ID
   * @returns 用户信息
   */
  async getUserInfo(id: number): Promise<HttpException | Users> {
    const userInfo = await this.userService.getUserInfo({ id });

    delete (userInfo as Partial<Users>).password; // 删除密码

    if (!userInfo) return new HttpException('用户不存在', HttpStatus.BAD_REQUEST);

    return userInfo;
  }

  /**
   * 获取用户权限菜单
   * @param roleId 角色ID
   * @returns 用户权限菜单
   * @throws HttpException
   */
  async getUserMenuService(roleId: number): Promise<HttpException | Menus[]> {
    // 获取角色对应的菜单id
    const menuIdList = await this.permissionService.getMenuIdsByRoleId(roleId);

    if (menuIdList instanceof HttpException) {
      throw menuIdList;
    }

    if (!menuIdList.length) return [];

    // 根据菜单ID获取菜单列表
    const menuList = await this.menuService.getMenuListById(menuIdList);

    if (menuList instanceof HttpException) {
      throw menuList;
    }

    if (!menuList.length) return [];

    return initializeTree(menuList, 'id', 'parentId', 'children');
  }
}
