import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export interface ICreateMenu {
  menuType: string;
  status: number;
  parentId?: number;
  permission?: string;
  path?: string;
  menuIcon?: string;
  i18nName?: string;
}

export interface IEditMenu {
  id: number;
  menuType: string;
  status: number;
  parentId?: number;
  permission?: string;
  path?: string;
  menuIcon?: string;
  i18nName?: string;
}

@Entity('menus')
export class Menus extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', {
    name: 'menu_type',
    comment: '菜单类型(dir: 目录, menu: 菜单, button: 按钮)',
    length: 50,
    nullable: false,
  })
  menuType: string;

  @Column('varchar', { name: 'menu_icon', comment: '菜单图标', length: 50, nullable: false, default: () => '' })
  menuIcon?: string;

  @Column('int', { name: 'parent_id', comment: '父级id', nullable: false, default: () => "'0'" })
  parentId: number;

  @Column('varchar', {
    name: 'permission',
    comment: '菜单标识(页面按钮权限控制)',
    length: 100,
    nullable: false,
    default: () => '',
  })
  permission?: string;

  @Column('int', { name: 'sort', comment: '排序', nullable: false, default: () => "'0'" })
  sort: number;

  @Column('varchar', { name: 'path', comment: '路由url', length: 100 })
  path: string;

  @Column('varchar', { name: 'i18n_name', comment: '国际化对应的key', length: 50 })
  i18nName: string;

  @Column('int', { name: 'status', comment: '状态(0: 禁用, 1: 启用)', default: () => "'1'" })
  status: number;

  @Column('int', { name: 'create_time', comment: '创建时间', default: () => 'UNIX_TIMESTAMP()' })
  createTime: number;

  @Column('int', { name: 'update_time', comment: '更新时间', default: () => 'UNIX_TIMESTAMP()' })
  updateTime: number;
}
