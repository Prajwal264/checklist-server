import { inject, injectable } from 'inversify';
import { generate } from 'shortid';
import TYPES from '../types';
import { Column } from '../models/column.model';
import { ColumnService } from './column.service';

@injectable()
export class CardService {
  constructor(
    @inject(TYPES.ColumnService) readonly columnService: ColumnService,
  ) { }

  async create(columnId: string, payload: {
    parentId?: string;
    previousElementId?: string;
    title: string
    description?: string
  }) {
    const cardId = `cardId_${generate()}`;
    const column = await this.columnService.fetchOne({ columnId });
    const newCard = {
      cardId,
      title: payload.title,
      description: payload.description,
    };
    if (!column) {
      throw new Error('Column not found');
    }
    if (!payload.parentId) {
      if (!payload.previousElementId) {
        if (Array.isArray(column.children)) {
          column.children.push(newCard);
        }
      }
    }
    await column.save();
    return newCard;
  }

  delete(columnId: string) {
    return Column.deleteOne({ columnId });
  }
}
