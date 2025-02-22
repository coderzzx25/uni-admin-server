import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
   * 获取用户消息列表
   * @param userName 用户名
   * @returns 用户消息列表
   */
  @Get('/room/:userName')
  async getUserRooms(@Param('userName') userName: string) {
    const result = await this.chatService.getUserRooms(userName);
    return result;
  }

  /**
   * 获取对用房间历史消息
   * @param room 房间名
   * @returns 房间历史消息
   */
  @Get('/message/:room')
  async getRoomMessages(@Param('room') room: string) {
    const result = await this.chatService.getRoomMessages(room);
    return result;
  }
}
