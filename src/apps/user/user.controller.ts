import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { Users } from 'src/entities/users.entity';
import { Like } from 'typeorm';

type UserFields = keyof Users;

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('list')
  async getUserList(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('username') username?: string,
    @Query('workNo') workNo?: string,
    @Query('cnName') cnName?: string,
    @Query('enName') enName?: string,
    @Query('email') email?: string,
    @Query('phone') phone?: string,
    @Query('sex') sex?: number,
    @Query('status') status?: number,
    @Query('positionId') positionId?: number,
    @Query('departmentId') departmentId?: number,
    @Query('roleId') roleId?: number,
  ) {
    const where = {
      status,
      positionId,
      departmentId,
      roleId,
      sex,
      username: username ? Like(`%${username}%`) : undefined,
      workNo: workNo ? Like(`%${workNo}%`) : undefined,
      cnName: cnName ? Like(`%${cnName}%`) : undefined,
      enName: enName ? Like(`%${enName}%`) : undefined,
      email: email ? Like(`%${email}%`) : undefined,
      phone: phone ? Like(`%${phone}%`) : undefined,
    };
    const fields: UserFields[] = [
      'id',
      'username',
      'workNo',
      'cnName',
      'enName',
      'age',
      'email',
      'phone',
      'avatarUrl',
      'sex',
      'status',
      'positionId',
      'departmentId',
      'roleId',
      'createTime',
      'updateTime',
    ];
    const result = await this.userService.getUserList(where, fields, page, size);
    return result;
  }
}
