import { Controller, Get, HttpException, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @UseGuards(AuthGuard)
  @Get('list')
  async getPermissionList(
    @Query('size') size: number,
    @Query('page') page: number,
    @Query('roleId') roleId?: number,
    @Query('status') status?: number,
  ) {
    if (!size || !page) {
      throw new HttpException('参数错误', HttpStatus.BAD_REQUEST);
    }
    const where = { roleId, status };

    const result = await this.permissionService.getPermissionList(where, [], page, size);

    return result;
  }
}
