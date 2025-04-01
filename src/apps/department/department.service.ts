import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from 'src/entities/department.entity';
import { getTimestamp, initializeTree, timestampToDate } from 'src/utils';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';

@Injectable()
export class DepartmentService {
  constructor(@InjectRepository(Department) private readonly departmentRepository: typeof Department) {}

  async getDepartmentList(where: FindOptionsWhere<Department>, fields: FindManyOptions<Department>['select']) {
    const data = await this.departmentRepository.find({ where, select: fields });

    const filterData = data.map((item) => ({
      ...item,
      parentId: item.parentId || undefined,
      createTime: timestampToDate(item.createTime),
      updateTime: timestampToDate(item.updateTime),
    }));

    const result = initializeTree(filterData, 'id', 'parentId', 'children');

    return result;
  }

  async createDepartment(data: { name: string; status: number; parentId?: number }) {
    const { name, status, parentId } = data;
    const createTime = getTimestamp();
    const updateTime = createTime;
    return await this.departmentRepository.save({ name, parentId, status, createTime, updateTime });
  }

  async updateDepartment(id: number, data: { name?: string; status?: number; parentId?: number }) {
    const updateTime = getTimestamp();
    return await this.departmentRepository.update(id, { ...data, updateTime });
  }

  async getDepartmentByName(name: string) {
    return await this.departmentRepository.findOneBy({ name });
  }
}
