import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menus } from 'src/entities/menus.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class MenuService {
  constructor(@InjectRepository(Menus) private readonly menusRepository: Repository<Menus>) {}

  async getMenuListById(ids: string): Promise<HttpException | Menus[]> {
    try {
      const result = await this.menusRepository.find({
        where: { id: In(ids.split(',')), menuType: In(['dir', 'menu']), status: 1 },
        order: { sort: 'DESC' },
      });
      return result;
    } catch (error) {
      console.error(error.message); // TODO: 记录错误日志
      return new HttpException('获取菜单失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
