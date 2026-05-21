import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { LlmService } from './llm.service';
import { Message, MessageSchema } from '../../database/schemas/message.schema';
import { Session, SessionSchema } from '../../database/schemas/session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService, LlmService],
  exports: [ChatService, LlmService],
})
export class ChatModule {}
