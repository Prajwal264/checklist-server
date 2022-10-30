import { model, Schema } from 'mongoose';
import type { ICard } from '../services/card.service';

export interface IColumn {
  title: string;
  description?: string;
  boardId: string;
  expanded?: boolean;
  columnId: string;
  children: ICard[]; // why am i jugading
}

const columnsSchema = new Schema({
  title: {
    type: 'String', required: true,
  },
  description: {
    type: 'String',
  },
  expanded: {
    type: 'Boolean', default: true,
  },
  boardId: {
    type: 'String', required: true, index: true,
  },
  columnId: {
    type: 'String', required: true, unique: true, index: true,
  },
  children: [],
}, { timestamps: true });

export const Column = model<IColumn>('Column', columnsSchema);
