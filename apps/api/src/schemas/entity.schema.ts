import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type EntityDocument = Entity & Document;

export enum EntityType {
  URL = 'URL',
  PHONE = 'PHONE',
  UPI = 'UPI',
}

@Schema({ timestamps: true })
export class Entity {
  @Prop({ required: true, enum: EntityType })
  type: string;

  @Prop({ required: true, unique: true })
  value: string;

  @Prop({ default: 50, min: 0, max: 100 })
  riskScore: number;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  lastScannedAt: Date;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Report' }] })
  reportIds: string[];
}

export const EntitySchema = SchemaFactory.createForClass(Entity);
