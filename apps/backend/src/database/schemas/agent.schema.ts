import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AgentDocument = Agent & Document;

@Schema({ timestamps: true })
export class Agent {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop({
    type: {
      model: { type: String, default: 'gpt-4' },
      temperature: { type: Number, default: 0.7, min: 0, max: 2 },
      systemPrompt: { type: String, default: 'You are a helpful AI assistant.' },
      maxTokens: { type: Number, default: 1000 },
    },
    _id: false,
  })
  config: {
    model: string;
    temperature: number;
    systemPrompt: string;
    maxTokens?: number;
  };

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Object, default: {} })
  metadata?: Record<string, any>;
}

export const AgentSchema = SchemaFactory.createForClass(Agent);

// Indexes
AgentSchema.index({ owner: 1, createdAt: -1 });
AgentSchema.index({ name: 'text', description: 'text' });
