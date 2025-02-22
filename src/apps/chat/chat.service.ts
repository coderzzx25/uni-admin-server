import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Messages } from 'src/entities/messages.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(@InjectRepository(Messages) private readonly messagesRepository: Repository<Messages>) {}

  /**
   * 查询用户消息列表
   * @param userName 用户名
   * @returns 用户消息列表
   */
  async getUserRooms(userName: string): Promise<{ roomNames: string; receiver: string }[]> {
    const rooms = await this.messagesRepository
      .createQueryBuilder('messages')
      .select('DISTINCT room')
      .where('sender = :userName OR receiver = :userName', { userName })
      .getRawMany();

    const roomNames = rooms.map((room) => {
      const users = room.room.split('-');
      const otherUser = users[0] === userName ? users[1] : users[0];
      return { roomNames: room.room, receiver: otherUser };
    });

    return roomNames;
  }

  /**
   * 查询房间历史消息
   * @param room 房间名
   * @returns 房间历史消息
   */
  async getRoomMessages(room: string): Promise<Messages[]> {
    const messages = await this.messagesRepository.find({ where: { room } });
    return messages;
  }

  /**
   * 保存消息
   * @param sender 发送人
   * @param receiver 接收人
   * @param message 消息内容
   * @param room 房间名
   */
  async saveMessage(sender: string, receiver: string, message: string, room: string): Promise<void> {
    // TODO:时间待后续优化
    const newMessage = this.messagesRepository.create({ sender, receiver, message, room });
    await this.messagesRepository.save(newMessage);
  }
}
