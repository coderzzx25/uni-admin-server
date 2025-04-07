import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity('permissions')
export class Permissions extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '权限ID' })
  id: number;

  @Column({ name: 'role_id', default: 0, comment: '角色ID' })
  roleId: number;

  @Column({ name: 'menu_id', length: 200, default: '', comment: '菜单ID' })
  menuId: string;

  @Column({ name: 'create_time', default: 0, comment: '创建时间' })
  createTime: number;

  @Column({ name: 'update_time', default: 0, comment: '更新时间' })
  updateTime: number;

  @Column({ default: 0, comment: '状态:0:禁用, 1:启用' })
  status: number;
}

export interface IEditPermission {
  id: number;
  roleId: number;
  menuId: number[];
  status: number;
}

export interface ICreatePermission {
  roleId: number;
  menuId: number[];
  status: number;
}

export interface ICreatePermissionService {
  roleId: number;
  menuId: string;
  status: number;
}
