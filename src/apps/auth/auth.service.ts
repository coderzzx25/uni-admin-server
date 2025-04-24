import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { Users } from 'src/entities/users.entity';
import { ILoginResult, ILoginData } from './auth.interface';
import { UserService } from '../user/user.service';
import { MenuService } from '../menu/menu.service';
import { comparePassword, initializeTree } from 'src/utils';
import { Menus } from 'src/entities/menus.entity';
import { RoleService } from '../role/role.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly roleService: RoleService,
    private readonly menuService: MenuService,
  ) {}

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
    const isPasswordValid = comparePassword(password, userInfo.password);

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
  validateTokenService(token: string) {
    try {
      const result = this.jwtService.verify<ILoginResult>(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      // 确保返回值符合 ILoginResult 类型
      if (!result || typeof result !== 'object' || !('id' in result)) {
        throw new Error('Invalid token payload');
      }

      return result;
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error('Unknown error');
      return new HttpException(error, HttpStatus.UNAUTHORIZED);
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
    const menuIdList = await this.roleService.getMenuIdsByRoleId(roleId);

    if (!menuIdList) return [];

    const menuList = await this.menuService.getMenuListById(menuIdList.menuId);
    if (menuList instanceof HttpException) {
      throw menuList;
    }
    if (!menuList.length) return [];
    return initializeTree(menuList, 'id', 'parentId', 'children');
  }
}
