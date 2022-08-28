import { model, Schema } from 'mongoose';

export interface IColumn {
  title: string;
  description?: string;
  boardId: string;
  columnId: string;
  children: any[], // why am i jugading
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
  children: {
    type: 'Array', default: [],
  },
}, { timestamps: true });

export const Column = model('Column', columnsSchema);
