import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('department')
export class Department extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', comment: '部门名称', length: 30 })
  name: string;

  @Column('int', { name: 'parent_id', comment: '上级部门ID' })
  parentId: number;

  @Column('int', { name: 'create_time', comment: '创建时间', default: 0 })
  createTime: number;

  @Column('int', { name: 'update_time', comment: '更新时间', default: 0 })
  updateTime: number;

  @Column('int', { name: 'status', comment: '部门状态' })
  status: number;
}
