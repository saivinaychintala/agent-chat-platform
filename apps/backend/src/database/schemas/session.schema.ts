import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SessionDocument = Session & Document;

@Schema({ timestamps: true })
export class Session {
  @Prop({ type: Types.ObjectId, ref: 'Agent', required: true })
  agent: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['active', 'closed', 'archived'],
    default: 'active',
  })
  status: string;

  @Prop()
  title?: string;

  @Prop({ type: Object, default: {} })
  metadata?: Record<string, any>;

  @Prop()
  closedAt?: Date;

  @Prop({ type: Number, default: 0 })
  messageCount: number;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

// Indexes
SessionSchema.index({ user: 1, createdAt: -1 });
SessionSchema.index({ agent: 1, status: 1 });
SessionSchema.index({ status: 1, createdAt: -1 });
