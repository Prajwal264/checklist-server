import { model, Schema } from 'mongoose';

export interface IBoard {
  name: string;
  userId: string;
  boardId: string;
}

const boardsSchema = new Schema({
  name: {
    type: 'String', required: true,
  },
  userId: {
    type: 'String', required: true,
  },
  boardId: {
    type: 'String', required: true, unique: true, index: true,
  },
}, { timestamps: true });

export const Board = model('Board', boardsSchema);
