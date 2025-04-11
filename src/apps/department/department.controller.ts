import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { AuthGuard } from '../auth/auth.guard';

interface IEditDepartment {
  id: number;
  name?: string;
  parentId?: number;
  status?: number;
}

@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}
  @UseGuards(AuthGuard)
  @Get('list')
  async getPositionList(@Query('name') name?: string, @Query('status') status?: number, isTree?: boolean) {
    const where = { name, status };
    const result = await this.departmentService.getDepartmentList(where, [], isTree);
    return result;
  }

  @UseGuards(AuthGuard)
  @Post('create')
  async createDepartment(@Body() data: { name: string; parentId: number; status: number }) {
    if (!data) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
    }
    const { name, status, parentId } = data;
    if (!name || status === undefined) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
    }

    const where = {
      name,
      parentId: parentId || 0,
    };
    const existingRecords = await this.departmentService.getDepartmentList(where, []);

    if (existingRecords.length) {
      throw new HttpException('部门名称已存在', HttpStatus.BAD_REQUEST);
    }
    try {
      await this.departmentService.createDepartment({ name, status, parentId });
      return '创建成功';
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error('Unknown error');
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard)
  @Post('edit')
  async editPosition(@Body() body: IEditDepartment) {
    if (!body) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
    }
    const { id, name, parentId, status } = body;
    if (!id) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
    }
    if (!name && status === undefined && parentId === undefined) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
    }
    if (name) {
      const where = {
        name,
        parentId: parentId ?? 0,
      };
      const departmentInfo = await this.departmentService.getDepartmentList(where, []);
      if (departmentInfo.length && departmentInfo[0].id !== id) {
        throw new HttpException('部门名称已存在', HttpStatus.BAD_REQUEST);
      }
    }
    try {
      await this.departmentService.updateDepartment(id, { name, parentId, status });
      return '更新成功';
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error('Unknown error');
      return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
