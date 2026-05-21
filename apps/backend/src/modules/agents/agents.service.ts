import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Agent, AgentDocument } from '../../database/schemas/agent.schema';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';

@Injectable()
export class AgentsService {
  constructor(
    @InjectModel(Agent.name) private agentModel: Model<AgentDocument>,
  ) {}

  async create(userId: string, createAgentDto: CreateAgentDto) {
    const agent = await this.agentModel.create({
      ...createAgentDto,
      owner: new Types.ObjectId(userId),
    });

    return agent;
  }

  async findAll(userId: string) {
    const agents = await this.agentModel
      .find({ owner: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();

    return agents;
  }

  async findOne(id: string, userId: string) {
    const agent = await this.agentModel.findById(id).exec();

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    // Check ownership
    if (agent.owner.toString() !== userId) {
      throw new ForbiddenException('You do not have access to this agent');
    }

    return agent;
  }

  async update(id: string, userId: string, updateAgentDto: UpdateAgentDto) {
    const agent = await this.findOne(id, userId);

    Object.assign(agent, updateAgentDto);
    await agent.save();

    return agent;
  }

  async remove(id: string, userId: string) {
    const agent = await this.findOne(id, userId);
    await agent.deleteOne();

    return { message: 'Agent deleted successfully' };
  }
}
