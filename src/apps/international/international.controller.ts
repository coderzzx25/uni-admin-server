import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { IAllLocal, InternationalService } from './international.service';
import { ICanActivate } from '../auth/auth.interface';
import { getTimestamp } from 'src/utils';
import { Like } from 'typeorm';

@Controller('international')
export class InternationalController {
  constructor(private readonly internationalService: InternationalService) {}

  /**
   * 获取所有语言
   * @returns 语言数据
   */
  @Get('lang')
  async getAllLocalsLang(): Promise<IAllLocal> {
    const result = await this.internationalService.getAllLocalsLang();
    return result;
  }

  /**
   * 获取国际化数据
   * @param name 国际化字段
   * @returns 国际化数据
   */
  @UseGuards(AuthGuard)
  @Get('list')
  async getInternationalList(@Query('name') name?: string, @Query('status') status?: number) {
    const where = {
      name: name ? Like(`%${name}%`) : undefined,
      status,
    };

    const result = await this.internationalService.getInternationalList(where, []);

    return result;
  }

  /**
   * 创建国际化数据
   */
  @UseGuards(AuthGuard)
  @Post('create')
  async createInternational(
    @Body() data: { name: string; status: number; parentId?: number; enUS?: string; zhCN?: string },
    @Req() req: ICanActivate,
  ) {
    if (!data) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
    }
    const { name, status, parentId } = data;
    if (!name || status === undefined) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
    }
    // 校验
    const where = {
      name,
      parentId: parentId ?? 0,
    };

    const existingRecords = await this.internationalService.getInternationalList(where, []);

    if (existingRecords.length) {
      throw new HttpException('国际化字段已存在', HttpStatus.BAD_REQUEST);
    }
    try {
      const user = req.user;
      const dates = { ...data, founder: user.id, createTime: getTimestamp(), updateTime: getTimestamp() };
      await this.internationalService.createInternational(dates);
      return '创建成功';
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error('Unknown error');
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 编辑国际化数据
   */
  @UseGuards(AuthGuard)
  @Post('edit')
  async editInternational(@Body() data: { id: number; name: string; status: number; parentId?: number; enUS?: string; zhCN?: string }) {
    if (!data) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
    }
    const { id, name, status, parentId } = data;

    if (!id || !name || status === undefined) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
    }

    const where = {
      name,
      parentId: parentId ?? 0,
    };

    const existingRecords = await this.internationalService.getInternationalList(where, []);

    // 如果存在相同记录，并且id不相等，则抛出异常
    if (existingRecords.length && existingRecords[0].id !== id) {
      throw new HttpException('国际化字段已存在', HttpStatus.BAD_REQUEST);
    }

    try {
      const dates = { ...data, updateTime: getTimestamp() };
      await this.internationalService.updateInternational(id, dates);
      return '编辑成功';
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error('Unknown error');
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
