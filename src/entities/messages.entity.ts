import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('messages')
export class Messages extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ name: 'sender', length: 200, default: '', comment: '发送人' })
  sender: string;

  @Column({ name: 'receiver', length: 200, default: '', comment: '收取人' })
  receiver: string;

  @Column({ name: 'message', length: 255, default: '', comment: '消息内容' })
  message: string;

  @Column({ name: 'room', length: 200, default: '', comment: '房间名' })
  room: string;

  @Column({ name: 'create_time', default: 0, comment: '创建时间' })
  createTime: number;

  @Column({ name: 'update_time', default: 0, comment: '更新时间' })
  updateTime: number;

  @Column({ default: 1, comment: '状态:0:禁用, 1:启用' })
  status: number;
}
