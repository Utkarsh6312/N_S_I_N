import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';
import { Entity } from './entity.schema';

export type ReportDocument = Report & Document;

export class Evidence {
  @Prop()
  fileUrl: string;

  @Prop()
  fileType: string;

  @Prop()
  ocrText: string;
}

@Schema({ timestamps: true })
export class Report {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User | MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ enum: ['PENDING', 'VERIFIED', 'REJECTED'], default: 'PENDING' })
  status: string;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      required: false,
    },
    coordinates: {
      type: [Number],
      required: false,
    },
  })
  location: Record<string, any>;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Entity' }] })
  entities: Entity[] | MongooseSchema.Types.ObjectId[];

  @Prop({ type: [Evidence], default: [] })
  evidences: Evidence[];
}

export const ReportSchema = SchemaFactory.createForClass(Report);
ReportSchema.index({ location: '2dsphere' });
