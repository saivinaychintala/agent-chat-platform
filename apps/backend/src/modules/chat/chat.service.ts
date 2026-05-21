import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from '../../database/schemas/message.schema';
import { Session, SessionDocument } from '../../database/schemas/session.schema';
import { LlmService } from './llm.service';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    private llmService: LlmService,
  ) {}

  async sendMessage(
    sessionId: string,
    userId: string,
    sendMessageDto: SendMessageDto,
  ) {
    // Verify session exists and user has access
    const session = await this.sessionModel
      .findById(sessionId)
      .populate('agent')
      .exec();

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.user.toString() !== userId) {
      throw new NotFoundException('Session not found');
    }

    // Save user message
    const userMessage = await this.messageModel.create({
      session: new Types.ObjectId(sessionId),
      role: 'user',
      content: sendMessageDto.content,
      tokens: this.llmService.estimateTokens(sendMessageDto.content),
    });

    // Get conversation history
    const history = await this.getConversationHistory(sessionId);

    // Generate AI response
    const aiResponse = await this.llmService.generateResponse(
      (session.agent as any).config,
      history,
    );

    // Save AI message
    const assistantMessage = await this.messageModel.create({
      session: new Types.ObjectId(sessionId),
      role: 'assistant',
      content: aiResponse,
      tokens: this.llmService.estimateTokens(aiResponse),
    });

    // Update session message count
    await this.sessionModel.findByIdAndUpdate(sessionId, {
      $inc: { messageCount: 2 },
    });

    return {
      userMessage,
      assistantMessage,
    };
  }

  async getMessages(sessionId: string, userId: string) {
    // Verify session access
    const session = await this.sessionModel.findById(sessionId);

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.user.toString() !== userId) {
      throw new NotFoundException('Session not found');
    }

    // Get messages
    const messages = await this.messageModel
      .find({ session: new Types.ObjectId(sessionId) })
      .sort({ createdAt: 1 })
      .exec();

    return messages;
  }

  private async getConversationHistory(sessionId: string) {
    const messages = await this.messageModel
      .find({ session: new Types.ObjectId(sessionId) })
      .sort({ createdAt: 1 })
      .limit(20) // Limit to last 20 messages
      .exec();

    return messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));
  }
}
