import { injectable } from 'inversify';
import { FilterQuery } from 'mongoose';
import { generate } from 'shortid';
import { Column, IColumn } from '../models/column.model';

@injectable()
export class ColumnService {
  create(boardId: string, payload: {
    title: string
    description?: string
  }) {
    const columnId = `column_${generate()}`;
    return new Column({
      title: payload.title,
      description: payload.description || undefined,
      columnId,
      boardId,
    }).save();
  }

  fetchAll(findQuery: FilterQuery<IColumn>) {
    return Column.find(findQuery);
  }
}
