import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Messages } from 'src/entities/messages.entity';
import { ChatController } from './chat.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Messages])],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
