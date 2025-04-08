import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Positions } from 'src/entities/positions.entity';
import { getTimestamp, initializeTree, timestampToDate } from 'src/utils';
import { FindManyOptions, FindOptionsWhere, Not } from 'typeorm';

@Injectable()
export class PositionsService {
  constructor(@InjectRepository(Positions) private readonly positionsRepository: typeof Positions) {}

  /**
   * 获取职位列表
   * @param where 查询条件
   * @param fields 返回字段
   * @param page 页码
   * @param size 每页数量
   * @returns 职位列表
   */
  async getPositionList(
    where: FindOptionsWhere<Positions>,
    fields: FindManyOptions<Positions>['select'],
    isTree = true,
  ) {
    const newWhere = {
      ...where,
    };
    const data = await this.positionsRepository.find({ where: newWhere, select: fields });

    const filterData = data.map((item) => ({
      ...item,
      parentId: item.parentId || undefined,
      createTime: timestampToDate(item.createTime),
      updateTime: timestampToDate(item.updateTime),
    }));

    const result = isTree ? initializeTree(filterData, 'id', 'parentId', 'children') : filterData;

    return result;
  }

  /**
   * 编辑职位
   * @param id 职位id
   * @param data 职位数据
   */
  async updatePosition(id: number, data: { name?: string; parentId?: number; status?: number }) {
    const updateTime = getTimestamp();
    const result = await this.positionsRepository.update(id, { ...data, updateTime });
    return result;
  }

  /**
   * 创建职位
   */
  async createPosition(data: { name: string; status: number; parentId?: number }) {
    const { name, status, parentId } = data;
    const createTime = getTimestamp();
    const updateTime = createTime;
    return await this.positionsRepository.save({ name, parentId, status, createTime, updateTime });
  }

  async getPositionByName(name: string) {
    return await this.positionsRepository.findOneBy({ name });
  }
}
