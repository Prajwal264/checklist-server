import { model, Schema } from 'mongoose';

export interface IColumn {
  title: string;
  description: string;
  boardId: string;
  columnId: string;
}

const columnsSchema = new Schema({
  title: {
    type: 'String', required: true,
  },
  description: {
    type: 'String',
  },
  boardId: {
    type: 'String', required: true, index: true,
  },
  columnId: {
    type: 'String', required: true, unique: true, index: true,
  },
}, { timestamps: true });

export const Column = model('Column', columnsSchema);
