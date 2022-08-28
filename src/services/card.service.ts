/* eslint-disable no-param-reassign */
import { inject, injectable } from 'inversify';
import { generate } from 'shortid';
import TYPES from '../types';
import { ColumnService } from './column.service';

export interface ICard {
  title: string;
  checked: boolean;
  cardId: string;
}

@injectable()
export class CardService {
  constructor(
    @inject(TYPES.ColumnService) readonly columnService: ColumnService,
  ) { }

  async create(columnId: string, payload: {
    parentId?: string;
    previousElementId?: string;
    title: string
    checked: boolean
  }) {
    const cardId = `cardId_${generate()}`;
    const column = await this.columnService.fetchOne({ columnId });
    const newCard = {
      type: 'Card',
      cardId,
      title: payload.title,
      checked: payload.checked,
    };
    if (!column) {
      throw new Error('Column not found');
    }

    if (!payload.parentId) {
      if (!payload.previousElementId) {
        column.children.push(newCard);
      }
    }
    await column.save();
    return newCard;
  }

  async update({
    cardId,
    columnId,
  }: {
    cardId: string,
    columnId: string
  }, updateParams: Partial<ICard>) {
    const column = await this.columnService.fetchOne({ columnId });
    if (!column) {
      throw new Error('No Column found for the columnId');
    }
    column.children.forEach((child) => {
      if (child.cardId === cardId) {
        if (updateParams.title !== undefined) {
          child.title = updateParams.title;
        }
        if (updateParams.checked !== undefined) {
          child.checked = updateParams.checked;
        }
      }
    });
    column.markModified('children');
    await column.save();
    return {
      cardId,
      ...updateParams,
    };
  }
}
