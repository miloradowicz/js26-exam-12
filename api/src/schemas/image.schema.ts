import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { User } from '../core/schemas/user.schema';

@Schema({ versionKey: false })
export class Image extends Document<Types.ObjectId> {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: User.name,
    required: true,
  })
  author: User;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  image: string;
}

export type ImageDocument = HydratedDocument<Image>;

export const ImageSchema = SchemaFactory.createForClass(Image);
