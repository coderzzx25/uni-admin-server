import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICreateRole, IEditRole, Roles } from 'src/entities/roles.entity';
import { getTimestamp } from 'src/utils';
import { FindManyOptions, FindOptionsWhere, Not, Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(@InjectRepository(Roles) private readonly rolesRepository: Repository<Roles>) {}

  /**
   * 获取角色列表
   * @param where 查询条件
   * @param fields 查询字段
   * @param page 页码
   * @param size 每页数量
   * @returns 角色列表
   */
  async getRoleList(where: FindOptionsWhere<Roles>, fields: FindManyOptions<Roles>['select'], page = 1, size = 10) {
    const skip = (page - 1) * size;

    const newWhere = {
      ...where,
    };
    const [list, total] = await this.rolesRepository.findAndCount({
      where: newWhere,
      order: {
        id: 'DESC',
      },
      select: fields,
      skip,
      take: size,
    });

    return {
      list,
      total,
    };
  }

  async updateRole(data: IEditRole) {
    const updateTime = getTimestamp();
    const result = await this.rolesRepository.update(data.id, { ...data, updateTime });
    return result;
  }

  async getRoleByName(name: string) {
    const result = await this.rolesRepository.findOne({
      where: {
        name,
      },
    });

    return result;
  }

  async createRole(data: ICreateRole) {
    const createTime = getTimestamp();
    const updateTime = createTime;

    return await this.rolesRepository.save({ ...data, createTime, updateTime });
  }

  async getAllRoles(fields: FindManyOptions<Roles>['select']) {
    return await this.rolesRepository.find({
      select: fields,
    });
  }
}
