import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Jobs } from 'src/entities/jobs.entity';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class JobService {
  constructor(@InjectRepository(Jobs) private readonly jobsRepository: Repository<Jobs>) {}

  /**
   * 获取职位列表
   * @param where 查询条件
   * @param fields 返回字段
   * @param page 页码
   * @param size 每页数量
   * @returns 职位列表
   */
  async getJobList(
    where: FindOptionsWhere<Jobs>,
    fields: FindManyOptions<Jobs>['select'],
    page = 1,
    size = 10,
  ): Promise<{ list: Jobs[]; total: number }> {
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
}
