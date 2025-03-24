import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { PositionsService } from './position.service';
import { IEditJob, IJobItem, Positions } from 'src/entities/positions.entity';
import { AuthGuard } from '../auth/auth.guard';
import { timestampToDate } from 'src/utils';

@Controller('position')
export class PositionController {
  constructor(private readonly positionsService: PositionsService) {}

  /**
   * 获取职位列表
   * @param page 分页
   * @param size 每页数量
   * @param name 职位名称
   * @param status 状态
   * @returns { list: IJobItem[], total: number } 职位列表
   */
  @UseGuards(AuthGuard)
  @Get('list')
  async getPositionList(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('name') name?: string,
    @Query('status') status?: number,
  ): Promise<{ list: IJobItem[]; total: number } | HttpException> {
    if (!page || !size) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
    }
    const where = { name, status };
    const result = await this.positionsService.getPositionList(where, [], page, size);
    const { list, total } = result;
    // 时间处理
    const lists = list.map((item: Positions) => ({
      ...item,
      createTime: timestampToDate(item.createTime),
      updateTime: timestampToDate(item.updateTime),
    }));
    return { list: lists, total };
  }

  /**
   * 编辑职位
   * @param id 职位id
   * @param name 职位名称
   * @param status 状态
   */
  @UseGuards(AuthGuard)
  @Post('edit')
  async editPosition(@Body() body: IEditJob) {
    if (!body) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
    }
    const { id, name, status } = body;
    if (!id) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
    }
    if (!name && status === undefined) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
    }
    if (name) {
      const positionInfo = await this.positionsService.getPositionByName(name);
      if (positionInfo && positionInfo.id !== id) {
        throw new HttpException('职位名称已存在', HttpStatus.BAD_REQUEST);
      }
    }
    try {
      await this.positionsService.updatePosition(id, { name, status });
      return '更新成功';
    } catch (error) {
      return new HttpException('更新失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 创建职位
   */
  @UseGuards(AuthGuard)
  @Post('create')
  async createPosition(@Body() data: { name: string; status: number }) {
    if (!data) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
    }
    const { name, status } = data;
    if (!name || status === undefined) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
    }
    const positionInfo = await this.positionsService.getPositionByName(name);
    if (positionInfo) {
      throw new HttpException('职位名称已存在', HttpStatus.BAD_REQUEST);
    }
    try {
      await this.positionsService.createPosition({ name, status });
      return '创建成功';
    } catch (error) {
      return new HttpException('创建失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
