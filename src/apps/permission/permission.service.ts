import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permissions } from 'src/entities/permissions.entity';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';
import { timestampToDate } from 'src/utils';

@Injectable()
export class PermissionService {
  constructor(@InjectRepository(Permissions) private readonly permissionsRepository: typeof Permissions) {}

  async getPermissionList(
    where: FindOptionsWhere<Permissions>,
    fields: FindManyOptions<Permissions>['select'],
    page = 1,
    size = 10,
  ) {
    const skip = (page - 1) * size;

    const newWhere = {
      ...where,
    };
    const [list, total] = await this.permissionsRepository.findAndCount({
      where: newWhere,
      select: fields,
      skip,
      take: size,
    });

    const result = list.map((item) => {
      return {
        ...item,
        menuId: item.menuId.split(',').map((item) => Number(item)),
        createTime: timestampToDate(item.createTime),
        updateTime: timestampToDate(item.updateTime),
      };
    });

    return {
      list: result,
      total,
    };
  }

  /**
   * 根据角色id获取菜单id列表
   * @param roleId 角色id
   * @returns 菜单id列表
   */
  async getMenuIdsByRoleId(roleId: number): Promise<HttpException | string> {
    try {
      const result = await this.permissionsRepository.query(
        `SELECT menu_id FROM permissions WHERE FIND_IN_SET(role_id, ${roleId}) AND status = 1`,
      );
      return result.map((item: { menu_id: string }) => item.menu_id).join(',');
    } catch (error) {
      console.error('错误信息', error.message); // TODO: 记录错误日志
      return new HttpException('获取菜单ID失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
