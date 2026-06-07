import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phone: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ enum: ['CITIZEN', 'ADMIN', 'GOVT'], default: 'CITIZEN' })
  role: string;

  @Prop({ default: 0 })
  trustScore: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
