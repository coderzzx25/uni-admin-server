import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'username', comment: '账户', length: 50 })
  username: string;

  @Column('varchar', { name: 'password', comment: '密码', length: 200 })
  password: string;

  @Column('varchar', { name: 'work_no', comment: '工号', length: 50 })
  workNo: string;

  @Column('varchar', { name: 'cn_name', comment: '中文名', length: 50 })
  cnName: string;

  @Column('varchar', { name: 'en_name', comment: '英文名', length: 50 })
  enName: string;

  @Column('int', { name: 'age', comment: '年龄' })
  age: number;

  @Column('varchar', { name: 'email', comment: '电子邮箱', length: 50 })
  email: string;

  @Column('varchar', { name: 'phone', comment: '电话号码', length: 50 })
  phone: string;

  @Column('varchar', { name: 'avatar_url', comment: '用户头像', length: 200 })
  avatarUrl: string;

  @Column('int', { name: 'sex', comment: '性别' })
  sex: number;

  @Column('int', { name: 'status', comment: '用户状态' })
  status: number;

  @Column('int', { name: 'position_id', comment: '岗位id' })
  positionId: number;

  @Column('int', { name: 'department_id', comment: '部门id' })
  departmentId: number;

  @Column('int', { name: 'role_id', comment: '角色id' })
  roleId: number;

  @Column({ name: 'create_time', default: 0, comment: '创建时间' })
  createTime: number;

  @Column({ name: 'update_time', default: 0, comment: '更新时间' })
  updateTime: number;
}
