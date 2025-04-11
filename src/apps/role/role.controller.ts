import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { AuthGuard } from '../auth/auth.guard';
import { timestampToDate } from 'src/utils';
import { ICreateRole, IEditRole, Roles } from 'src/entities/roles.entity';

@Controller('role')
export class RoleController {
  constructor(private readonly rolesService: RoleService) {}

  /**
   * 获取角色列表
   * @param page 分页
   * @param size 每页数量
   * @param name 角色名称
   * @param code 角色编码
   * @param status 状态
   * @returns 角色列表
   */
  @UseGuards(AuthGuard)
  @Get('list')
  async getRoleList(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('name') name?: string,
    @Query('status') status?: number,
  ) {
    if (!page || !size) {
      throw new HttpException('ERROR_MESSAGE.INVALID_PARAMETER', HttpStatus.BAD_REQUEST);
    }

    const where = { name, status };
    const result = await this.rolesService.getRoleList(where, [], page, size);

    const { list, total } = result;

    const lists = list.map((item: Roles) => ({
      ...item,
      createTime: timestampToDate(item.createTime),
      updateTime: timestampToDate(item.updateTime),
    }));

    return { list: lists, total };
  }

  @UseGuards(AuthGuard)
  @Post('edit')
  async editRole(@Body() body: IEditRole) {
    if (!body) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
    }

    const { id, name } = body;

    if (!id || !name) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
    }

    const roleInfo = await this.rolesService.getRoleByName(name);

    if (roleInfo && roleInfo.id !== id) {
      throw new HttpException('角色已存在', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.rolesService.updateRole(body);
      return '更新成功';
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error('Unknown error');
      return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard)
  @Post('create')
  async createRole(@Body() body: ICreateRole) {
    if (!body) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
    }

    const { name } = body;

    if (!name) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
    }

    const roleInfo = await this.rolesService.getRoleByName(name);

    if (roleInfo) {
      throw new HttpException('角色已存在', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.rolesService.createRole(body);
      return '创建成功';
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error('Unknown error');
      return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard)
  @Get('all')
  async getAllRoles() {
    return await this.rolesService.getAllRoles(['id', 'name']);
  }
}
