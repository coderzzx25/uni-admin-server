import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { MenuService } from './menu.service';
import { AuthGuard } from '../auth/auth.guard';
import { ICreateMenu, IEditMenu } from 'src/entities/menus.entity';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @UseGuards(AuthGuard)
  @Get('list')
  async getMenuList(@Query('name') name?: string, @Query('status') status?: number) {
    const where = { name, status };

    const result = await this.menuService.getMenuList(where, []);

    return result;
  }

  @UseGuards(AuthGuard)
  @Post('create')
  async createMenu(@Body() body: ICreateMenu) {
    if (!body) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
    }
    const { menuType, status, parentId, permission, path } = body;
    if (!menuType || status === undefined) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
    }
    const where = {
      menuType,
      parentId: parentId || 0,
      path,
      permission,
    };
    const menuInfo = await this.menuService.getMenuList(where, []);

    if (menuInfo.length) {
      throw new HttpException('菜单已存在', HttpStatus.BAD_REQUEST);
    }
    try {
      await this.menuService.createMenu(body);
      return '创建成功';
    } catch (error) {
      throw new HttpException('创建失败', HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Post('edit')
  async editMenu(@Body() body: IEditMenu) {
    if (!body) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
    }
    const { id, menuType, status, parentId, permission, path } = body;
    if (!menuType || status === undefined) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
    }
    const where = {
      menuType,
      parentId: parentId || 0,
      path,
      permission,
    };
    const menuInfo = await this.menuService.getMenuList(where, []);

    if (menuInfo.length && menuInfo[0].id !== id) {
      throw new HttpException('菜单已存在', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.menuService.updateMenu(body);
      return '修改成功';
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Get('all')
  async getAllMenus() {
    return this.menuService.getAllMenus(['id', 'i18nName', 'parentId', 'menuType']);
  }
}
