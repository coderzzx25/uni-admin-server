import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(Users) private readonly usersRepository: Repository<Users>) {}

  /**
   * 查询用户信息
   * @param where 查询条件
   * @param fields 查询字段
   * @returns 用户信息
   */
  async getUserInfo(where: Partial<Users>, fields?: (keyof Users)[]): Promise<HttpException | Users | null> {
    try {
      return this.usersRepository.findOne({
        where: where as FindOptionsWhere<Users>,
        select: fields as (keyof Users)[],
      });
    } catch (error) {
      console.error(error); // TODO: 记录错误日志
      return new HttpException('查询用户信息失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
