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
    if (!column) {
      throw new Error('Column not found');
    }
    const newHeading: IHeading = {
      headingId,
      title: payload.title,
      children: [],
    };
    column.children.push(newHeading);
    await column.save();
    return newHeading;
  }

  async update({
    headingId,
    columnId,
  }: {
    headingId: string,
    columnId: string
  }, updateParams: Partial<IHeading>) {
    const column = await this.columnService.fetchOne({ columnId });
    if (!column) {
      throw new Error('No Column found for the columnId');
    }

    const updateHeading = (heading: IHeading) => {
      if (updateParams.title !== undefined) {
        heading.title = updateParams.title;
      }
    };

    column.children.forEach((child) => {
      if ('headingId' in child) {
        if (child.headingId === headingId) {
          updateHeading(child);
        }
      }
    });
    column.markModified('children');
    await column.save();
    return {
      headingId,
      ...updateParams,
    };
  }
}
