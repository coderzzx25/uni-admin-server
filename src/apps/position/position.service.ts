import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Positions } from 'src/entities/positions.entity';
import { getTimestamp } from 'src/utils';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class JobService {
  constructor(@InjectRepository(Positions) private readonly jobsRepository: Repository<Positions>) {}

  /**
   * 获取职位列表
   * @param where 查询条件
   * @param fields 返回字段
   * @param page 页码
   * @param size 每页数量
   * @returns 职位列表
   */
  async getJobList(
    where: FindOptionsWhere<Positions>,
    fields: FindManyOptions<Positions>['select'],
    page = 1,
    size = 10,
  ): Promise<{ list: Positions[]; total: number }> {
    const skip = (page - 1) * size;
    const [list, total] = await this.jobsRepository.findAndCount({
      where,
      select: fields,
      skip,
      take: size,
    });
    return {
      list,
      total,
    };
  }

  /**
   * 编辑职位
   * @param id 职位id
   * @param data 职位数据
   */
  async updateJob(id: number, data: { name?: string; status?: number }) {
    const updateTime = getTimestamp();
    const result = await this.jobsRepository.update(id, { ...data, updateTime });
    return result;
  }
}
