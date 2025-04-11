import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICreateMenu, IEditMenu, Menus } from 'src/entities/menus.entity';
import { getTimestamp, initializeTree, timestampToDate } from 'src/utils';
import { FindManyOptions, FindOptionsWhere, In, Repository } from 'typeorm';

@Injectable()
export class MenuService {
  constructor(@InjectRepository(Menus) private readonly menusRepository: Repository<Menus>) {}

  async getMenuList(where: FindOptionsWhere<Menus>, fields: FindManyOptions<Menus>['select']) {
    const data = await this.menusRepository.find({ where, select: fields });

    const filterData = data.map((item) => ({
      ...item,
      name: item.parentId ? (item.menuType === 'button' ? item.i18nName : `${item.menuType}.${item.i18nName}`) : item.i18nName,
      parentId: item.parentId || undefined,
      createTime: timestampToDate(item.createTime),
      updateTime: timestampToDate(item.updateTime),
    }));

    const result = initializeTree(filterData, 'id', 'parentId', 'children');

    return result;
  }

  async createMenu(data: ICreateMenu) {
    const createTime = getTimestamp();
    const updateTime = createTime;
    return await this.menusRepository.save({ ...data, createTime, updateTime });
  }

  async updateMenu(data: IEditMenu) {
    const updateTime = getTimestamp();
    const result = await this.menusRepository.update(data.id, { ...data, updateTime });
    return result;
  }

  async getMenuListById(ids: string): Promise<HttpException | Menus[]> {
    try {
      const result = await this.menusRepository.find({
        where: { id: In(ids.split(',')), menuType: In(['dir', 'menus']), status: 1 },
        order: { sort: 'DESC' },
      });
      return result;
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error('An error occurred');
      return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllMenus(fields: FindManyOptions<Menus>['select']) {
    const data = await this.menusRepository.find({
      select: fields,
    });

    const filterData = data.map((item) => ({
      ...item,
      parentId: item.parentId || undefined,
      name: item.parentId ? (item.menuType === 'button' ? item.i18nName : `${item.menuType}.${item.i18nName}`) : item.i18nName,
    }));

    return filterData;
  }
}
