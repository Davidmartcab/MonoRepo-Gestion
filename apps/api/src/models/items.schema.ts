import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UUID } from 'crypto';
import { Document } from 'mongoose';

export type ItemDocument = Item & Document;

@Schema({ timestamps: true })
export class Item {
  @Prop()
  code: string;

  @Prop()
  password: string;

  @Prop([String])
  names: string[];

  @Prop([
    {
      title: String,
      payer: String,
      amount: Number,
      debtors: [String],
    },
  ])
  items: {
    uuid: UUID;
    title: string;
    payer: string;
    amount: number;
    debtors: string[];
    createdAt: Date;
  }[];
}

export const ItemSchema = SchemaFactory.createForClass(Item);
