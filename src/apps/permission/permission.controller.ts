import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { AuthGuard } from '../auth/auth.guard';
import { ICreatePermission, IEditPermission } from 'src/entities/permissions.entity';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @UseGuards(AuthGuard)
  @Get('list')
  async getPermissionList(
    @Query('size') size: number,
    @Query('page') page: number,
    @Query('roleId') roleId?: number,
    @Query('status') status?: number,
  ) {
    if (!size || !page) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
    }
    const where = { roleId, status };

    const result = await this.permissionService.getPermissionList(where, [], page, size);

    return result;
  }

  @UseGuards(AuthGuard)
  @Post('create')
  async createPermission(@Body() body: ICreatePermission) {
    if (!body) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
    }

    const { roleId, menuId } = body;

    const permissionInfo = await this.permissionService.getPermissionByRoleId(roleId);

    if (permissionInfo) {
      throw new HttpException('该角色已存在权限', HttpStatus.BAD_REQUEST);
    }

    const menuList = menuId.join(',');

    try {
      await this.permissionService.createPermission({ ...body, menuId: menuList });
      return '创建成功';
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error('An error occurred');
      return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard)
  @Post('edit')
  async editPermission(@Body() body: IEditPermission) {
    if (!body) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
    }

    const { id, roleId, menuId } = body;

    if (!id) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
    }

    const permissionInfo = await this.permissionService.getPermissionByRoleId(roleId);

    if (permissionInfo && permissionInfo.id !== id) {
      throw new HttpException('禁止修改角色', HttpStatus.BAD_REQUEST);
    }

    const menuList = menuId.join(',');
    try {
      await this.permissionService.updatePermission(id, { ...body, menuId: menuList });
      return '更新成功';
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error('An error occurred');
      return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
