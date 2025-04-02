import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

export interface ICreateRole {
  name: string;
  code?: string;
  describe?: string;
  status: number;
}

export interface IEditRole {
  id: number;
  name: string;
  code?: string;
  describe?: string;
  status: number;
}

@Entity('roles')
export class Roles extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ name: 'name', length: 20, default: '', comment: '角色名称' })
  name: string;

  @Column({ name: 'code', length: 20, default: '', comment: '角色编码' })
  code: string;

  @Column({ length: 200, default: '', comment: '角色描述' })
  describe: string;

  @Column({ default: 0, comment: '排序' })
  sort: number;

  @Column({ name: 'create_time', default: 0, comment: '创建时间' })
  createTime: number;

  @Column({ name: 'update_time', default: 0, comment: '更新时间' })
  updateTime: number;

  @Column({ default: 0, comment: '状态:0:禁用, 1:启用' })
  status: number;
}
