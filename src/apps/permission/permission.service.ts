import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICreatePermissionService, Permissions } from 'src/entities/permissions.entity';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { getTimestamp, timestampToDate } from 'src/utils';

@Injectable()
export class PermissionService {
  constructor(@InjectRepository(Permissions) private readonly permissionsRepository: Repository<Permissions>) {}

  async getPermissionList(where: FindOptionsWhere<Permissions>, fields: FindManyOptions<Permissions>['select'], page = 1, size = 10) {
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
  async getMenuIdsByRoleId(roleId: number): Promise<string | HttpException> {
    try {
      const result = await this.permissionsRepository.findOne({
        where: {
          roleId,
        },
      });
      return result?.menuId || '';
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error('An error occurred');
      console.error('错误信息', error.message); // TODO: 记录错误日志
      return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createPermission(data: ICreatePermissionService) {
    const createTime = getTimestamp();
    const updateTime = createTime;
    const result = await this.permissionsRepository.save({ ...data, createTime, updateTime });
    return result;
  }

  async updatePermission(id: number, data: ICreatePermissionService) {
    const updateTime = getTimestamp();
    const result = await this.permissionsRepository.update(id, { ...data, updateTime });
    return result;
  }

  async getPermissionByRoleId(roleId: number) {
    const result = await this.permissionsRepository.findOne({
      where: {
        roleId,
      },
    });

    return result;
  }
}
