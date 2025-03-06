import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('jobs')
export class Jobs extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', comment: '职位名称', length: 20 })
  name: string;

  @Column('int', { name: 'create_time', comment: '创建时间', default: () => 'UNIX_TIMESTAMP()' })
  createTime: number;

  @Column('int', { name: 'update_time', comment: '更新时间', default: () => 'UNIX_TIMESTAMP()' })
  updateTime: number;

  @Column('int', { name: 'status', comment: '用户状态' })
  status: number;
}
