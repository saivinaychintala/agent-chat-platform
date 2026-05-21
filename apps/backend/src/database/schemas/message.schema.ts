import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'Session', required: true, index: true })
  session: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true,
  })
  role: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop({ type: Number })
  tokens?: number;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

// Indexes
MessageSchema.index({ session: 1, createdAt: 1 });
MessageSchema.index({ createdAt: -1 });
