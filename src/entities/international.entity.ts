import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('international')
export class International extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', {
    name: 'name',
    comment: '国际化字段',
    length: 32,
    nullable: false,
    default: '',
  })
  name: string;

  @Column('int', {
    name: 'parent_id',
    comment: '父级ID',
    default: 0,
  })
  parentId?: number;

  @Column('varchar', {
    name: 'zh-CN',
    comment: '中文',
    length: 200,
    nullable: false,
    default: '',
  })
  zhCN?: string;

  @Column('varchar', {
    name: 'en-US',
    comment: '英文',
    length: 500,
    nullable: false,
    default: '',
  })
  enUS?: string;

  @Column('int', {
    name: 'founder',
    comment: '创建人',
    default: 0,
  })
  founder: number;

  @Column('int', { name: 'create_time', comment: '创建时间', default: () => 'UNIX_TIMESTAMP()' })
  createTime: number;

  @Column('int', { name: 'update_time', comment: '更新时间', default: () => 'UNIX_TIMESTAMP()' })
  updateTime: number;

  @Column('int', { name: 'status', comment: '状态(0: 禁用, 1: 启用)', default: () => "'1'" })
  status: number;

  children?: International[];
}
