import { Schema } from 'mongoose';
export class Hobby {
  _id: Schema.Types.ObjectId;
  name: string;
  description: string;
  favourite: boolean;
  user_id: Schema.Types.ObjectId;
  created: Date;
}
