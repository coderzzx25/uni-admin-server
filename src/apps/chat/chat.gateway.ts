import { Inject, Logger } from '@nestjs/common';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer() wss: Server;
  private logger: Logger = new Logger('ChatGateway');

  constructor(private readonly chatService: ChatService) {}

  afterInit(server: Server) {
    this.logger.log('初始化');
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    this.logger.log(`${client.id} 加入房间 ${room}`);
  }

  /**
   * 接收客户端消息
   * @param client 客户端
   * @param message { sender: string, receiver: string, message: string }
   */
  @SubscribeMessage('chatToServer')
  async handleMessage(client: Socket, message: { sender: string; receiver: string; message: string }): Promise<void> {
    // 创建房间名
    const roomName = [message.sender, message.receiver].sort().join('-');
    // 保存消息到数据库
    await this.chatService.saveMessage(message.sender, message.receiver, message.message, roomName);
    // 发送消息给指定的客户端
    this.wss.to(roomName).emit('chatToClient', message);
  }
}
