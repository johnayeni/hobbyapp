import { Schema } from 'mongoose';

export class User {
  _id: Schema.Types.ObjectId;
  fullname: string;
  email: string;
  phone_number: string;
  password: string;
  access_token: string;
  created: Date;
}
