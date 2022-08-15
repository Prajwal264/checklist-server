import { Schema, model } from 'mongoose';

export interface IUser {
  userId: string;
  username: string;
  email: string;
  password: string;
  refreshToken: string;
}

const usersSchema = new Schema({
  userId: {
    type: 'String', required: true, unique: true, index: true,
  },
  username: {
    type: 'String', required: true, unique: true, index: true,
  },
  email: {
    type: 'String', required: true, unique: true, index: true,
  },
  password: {
    type: 'String', required: true, select: false,
  },
  refreshToken: {
    type: 'String', select: false,
  },
}, { timestamps: true });

export const User = model('User', usersSchema);
