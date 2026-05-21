import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Session, SessionDocument } from '../../database/schemas/session.schema';
import { Agent, AgentDocument } from '../../database/schemas/agent.schema';
import { CreateSessionDto } from './dto/create-session.dto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    @InjectModel(Agent.name) private agentModel: Model<AgentDocument>,
  ) {}

  async create(userId: string, createSessionDto: CreateSessionDto) {
    // Verify agent exists and user has access
    const agent = await this.agentModel.findById(createSessionDto.agentId);

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    if (agent.owner.toString() !== userId) {
      throw new ForbiddenException('You do not have access to this agent');
    }

    // Create session
    const session = await this.sessionModel.create({
      agent: new Types.ObjectId(createSessionDto.agentId),
      user: new Types.ObjectId(userId),
      title: createSessionDto.title,
      status: 'active',
    });

    return session.populate('agent');
  }

  async findAll(userId: string, filters?: { status?: string; agentId?: string }) {
    const query: any = { user: new Types.ObjectId(userId) };

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.agentId) {
      query.agent = new Types.ObjectId(filters.agentId);
    }

    const sessions = await this.sessionModel
      .find(query)
      .populate('agent')
      .sort({ createdAt: -1 })
      .exec();

    return sessions;
  }

  async findOne(id: string, userId: string) {
    const session = await this.sessionModel
      .findById(id)
      .populate('agent')
      .exec();

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    // Check ownership
    if (session.user.toString() !== userId) {
      throw new ForbiddenException('You do not have access to this session');
    }

    return session;
  }

  async close(id: string, userId: string) {
    const session = await this.findOne(id, userId);

    if (session.status === 'closed') {
      throw new BadRequestException('Session is already closed');
    }

    session.status = 'closed';
    session.closedAt = new Date();
    await session.save();

    return session;
  }

  async incrementMessageCount(sessionId: string) {
    await this.sessionModel.findByIdAndUpdate(sessionId, {
      $inc: { messageCount: 1 },
    });
  }

  async remove(id: string, userId: string) {
    const session = await this.findOne(id, userId);
    await session.deleteOne();

    return { message: 'Session deleted successfully' };
  }
}
