/* eslint-disable no-param-reassign */
import { inject, injectable } from 'inversify';
import { generate } from 'shortid';
import TYPES from '../types';
import { ICard } from './card.service';
import { ColumnService } from './column.service';

export interface IHeading {
  title: string;
  headingId: string;
  children: ICard[];
}

@injectable()
export class HeadingService {
  constructor(
    @inject(TYPES.ColumnService) readonly columnService: ColumnService,
  ) { }

  async create(columnId: string, payload: {
    title: string
  }) {
    const headingId = `headingId_${generate()}`;
    const column = await this.columnService.fetchOne({ columnId });
    const newHeading: IHeading = {
      headingId,
      title: payload.title,
      children: [],
    };
    if (!column) {
      throw new Error('Column not found');
    }

    column.children.push(newHeading);
    await column.save();
    return newHeading;
  }
}
