import { Controller, Get, HttpException, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { JobService } from './job.service';
import { Jobs } from 'src/entities/jobs.entity';
import { AuthGuard } from '../auth/auth.guard';
import { timestampToDate } from 'src/utils';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  /**
   * 获取职位列表
   */
  @UseGuards(AuthGuard)
  @Get('list')
  async getJobList(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('name') name?: string,
    @Query('status') status?: number,
  ): Promise<{ list: any[]; total: number } | HttpException> {
    if (!page || !size) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
    }
    const where = { name, status };
    const result = await this.jobService.getJobList(where, [], page, size);
    const { list, total } = result;
    // 时间处理
    const lists = list.map((item: Jobs) => ({
      ...item,
      createTime: timestampToDate(item.createTime),
      updateTime: timestampToDate(item.updateTime),
    }));
    return { list: lists, total };
  }
}
