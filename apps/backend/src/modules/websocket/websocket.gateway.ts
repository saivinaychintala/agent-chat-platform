import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from '../../database/schemas/message.schema';
import { Session, SessionDocument } from '../../database/schemas/session.schema';
import { LlmService } from '../chat/llm.service';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },
})
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    private llmService: LlmService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      // Extract token from handshake
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        client.disconnect();
        return;
      }

      // Verify JWT
      const payload = this.jwtService.verify(token);
      client.data.userId = payload.sub;
      client.data.email = payload.email;

      console.log(`Client connected: ${client.id} (User: ${payload.email})`);
    } catch (error) {
      console.error('WebSocket auth error:', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_session')
  async handleJoinSession(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string },
  ) {
    try {
      const { sessionId } = data;

      // Verify session exists and user has access
      const session = await this.sessionModel.findById(sessionId);

      if (!session || session.user.toString() !== client.data.userId) {
        client.emit('error', { message: 'Session not found or access denied' });
        return;
      }

      // Join room
      client.join(`session:${sessionId}`);

      // Send message history
      const messages = await this.messageModel
        .find({ session: new Types.ObjectId(sessionId) })
        .sort({ createdAt: 1 })
        .exec();

      client.emit('session_history', messages);

      console.log(`Client ${client.id} joined session ${sessionId}`);
    } catch (error) {
      client.emit('error', { message: 'Failed to join session' });
    }
  }

  @SubscribeMessage('leave_session')
  handleLeaveSession(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string },
  ) {
    const { sessionId } = data;
    client.leave(`session:${sessionId}`);
    console.log(`Client ${client.id} left session ${sessionId}`);
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string; content: string },
  ) {
    try {
      const { sessionId, content } = data;

      // Verify session
      const session = await this.sessionModel
        .findById(sessionId)
        .populate('agent')
        .exec();

      if (!session || session.user.toString() !== client.data.userId) {
        client.emit('error', { message: 'Session not found or access denied' });
        return;
      }

      // Save user message
      const userMessage = await this.messageModel.create({
        session: new Types.ObjectId(sessionId),
        role: 'user',
        content,
        tokens: this.llmService.estimateTokens(content),
      });

      // Broadcast user message to all clients in session
      this.server.to(`session:${sessionId}`).emit('new_message', {
        ...userMessage.toObject(),
        _id: userMessage._id.toString(),
      });

      // Emit typing indicator
      this.server
        .to(`session:${sessionId}`)
        .emit('typing', { isTyping: true });

      // Get conversation history
      const history = await this.getConversationHistory(sessionId);

      // Generate AI response
      const aiResponse = await this.llmService.generateResponse(
        (session.agent as any).config,
        history,
      );

      // Stop typing indicator
      this.server
        .to(`session:${sessionId}`)
        .emit('typing', { isTyping: false });

      // Save AI message
      const assistantMessage = await this.messageModel.create({
        session: new Types.ObjectId(sessionId),
        role: 'assistant',
        content: aiResponse,
        tokens: this.llmService.estimateTokens(aiResponse),
      });

      // Broadcast AI message
      this.server.to(`session:${sessionId}`).emit('new_message', {
        ...assistantMessage.toObject(),
        _id: assistantMessage._id.toString(),
      });

      // Update session message count
      await this.sessionModel.findByIdAndUpdate(sessionId, {
        $inc: { messageCount: 2 },
      });
    } catch (error) {
      console.error('Error sending message:', error);
      client.emit('error', { message: 'Failed to send message' });
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string; isTyping: boolean },
  ) {
    const { sessionId, isTyping } = data;
    
    // Broadcast typing status to others in the session
    client.to(`session:${sessionId}`).emit('user_typing', {
      userId: client.data.userId,
      email: client.data.email,
      isTyping,
    });
  }

  private async getConversationHistory(sessionId: string) {
    const messages = await this.messageModel
      .find({ session: new Types.ObjectId(sessionId) })
      .sort({ createdAt: 1 })
      .limit(20)
      .exec();

    return messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));
  }
}
