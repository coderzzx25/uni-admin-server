import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';
import Redis from 'ioredis';

import { International } from 'src/entities/international.entity';
import { initializeLang, initializeTree, timestampToDate } from 'src/utils';
import RedisKey from 'src/constants/redis.key';

interface ICreateInternational {
  name: string;
  founder: number;
  createTime: number;
  updateTime: number;
  status: number;
  enUS?: string;
  zhCN?: string;
  parentId?: number;
}

interface IUpdateInternational {
  name: string;
  founder?: number;
  createTime?: number;
  updateTime: number;
  status: number;
  enUS?: string;
  zhCN?: string;
  parentId?: number;
}

export interface IAllLocal {
  zhCN: Record<string, unknown>;
  enUS: Record<string, unknown>;
}

@Injectable()
export class InternationalService {
  constructor(
    @InjectRepository(International) private readonly internationalRepository: typeof International,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  async getAllLocalsLang(): Promise<IAllLocal> {
    const LANGS = ['zhCN', 'enUS'] as const;
    const result: Partial<IAllLocal> = {};

    const redisLocales = await this.redis.get(RedisKey.LOCALES);

    if (redisLocales) {
      return JSON.parse(redisLocales) as IAllLocal;
    }

    const sqlData = await this.internationalRepository.find();

    const treeLang = initializeTree(sqlData, 'id', 'parentId', 'children');

    // 区分语言
    for (let i = 0; i < LANGS.length; i++) {
      const lang = LANGS[i];
      result[lang] = initializeLang(treeLang, lang, 'name');
    }

    // 将数据缓存到redis中
    await this.redis.set(RedisKey.LOCALES, JSON.stringify(result));

    return result as IAllLocal;
  }

  async getInternationalList(where: FindOptionsWhere<International>, fields: FindManyOptions<International>['select']) {
    const data = await this.internationalRepository.find({
      where,
      select: fields,
    });
    const filterData = data.map((item) => ({
      ...item,
      parentId: item.parentId || undefined,
      createTime: timestampToDate(item.createTime),
      updateTime: timestampToDate(item.updateTime),
    }));
    const result = initializeTree(filterData, 'id', 'parentId', 'children');
    return result;
  }

  async createInternational(data: ICreateInternational) {
    const international = new International();
    Object.assign(international, data);
    const result = await this.internationalRepository.save(international);
    // 删除redis缓存
    await this.redis.del(RedisKey.LOCALES);
    return result;
  }

  async updateInternational(id: number, data: IUpdateInternational) {
    const result = await this.internationalRepository.update(id, data);
    // 删除redis缓存
    await this.redis.del(RedisKey.LOCALES);
    return result;
  }
}
