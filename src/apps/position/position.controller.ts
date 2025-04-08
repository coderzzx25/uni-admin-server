import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { PositionsService } from './position.service';
import { IEditJob } from 'src/entities/positions.entity';
import { AuthGuard } from '../auth/auth.guard';

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
    @Query('name') name?: string,
    @Query('status') status?: number,
    @Query('isTree') isTree?: boolean,
  ) {
    const where = { name, status };
    const result = await this.positionsService.getPositionList(where, [], isTree);

    return result;
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
      throw new HttpException('ERROR_MESSAGE.INVALID_PARAMETER', HttpStatus.BAD_REQUEST);
    }
    const { id, name, parentId, status } = body;
    if (!id) {
      throw new HttpException('ERROR_MESSAGE.INVALID_PARAMETER', HttpStatus.BAD_REQUEST);
    }
    if (!name && status === undefined && parentId === undefined) {
      throw new HttpException('ERROR_MESSAGE.INVALID_PARAMETER', HttpStatus.BAD_REQUEST);
    }
    if (name) {
      const positionInfo = await this.positionsService.getPositionByName(name);
      if (positionInfo && positionInfo.id !== id) {
        throw new HttpException('SYSTEM.POSITION.MODAL_CONFIG.FORM_CONFIG.ERROR_POSITION_NAME', HttpStatus.BAD_REQUEST);
      }
    }
    try {
      await this.positionsService.updatePosition(id, { name, parentId, status });
      return 'SUCCESS_MESSAGE.UPDATE_SUCCESS';
    } catch (error) {
      return new HttpException('ERROR_MESSAGE.UPDATE_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 创建职位
   */
  @UseGuards(AuthGuard)
  @Post('create')
  async createPosition(@Body() data: { name: string; parentId: number; status: number }) {
    if (!data) {
      throw new HttpException('ERROR_MESSAGE.INVALID_PARAMETER', HttpStatus.BAD_REQUEST);
    }
    const { name, status, parentId } = data;
    if (!name || status === undefined) {
      throw new HttpException('ERROR_MESSAGE.INVALID_PARAMETER', HttpStatus.BAD_REQUEST);
    }
    const positionInfo = await this.positionsService.getPositionByName(name);
    if (positionInfo) {
      throw new HttpException('SYSTEM.POSITION.MODAL_CONFIG.FORM_CONFIG.ERROR_POSITION_NAME', HttpStatus.BAD_REQUEST);
    }
    try {
      await this.positionsService.createPosition({ name, status, parentId });
      return 'SUCCESS_MESSAGE.CREATE_SUCCESS';
    } catch (error) {
      throw new HttpException('SUCCESS_MESSAGE.CREATE_SUCCESS', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
