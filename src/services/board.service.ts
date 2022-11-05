import { injectable } from 'inversify';
import { FilterQuery } from 'mongoose';
import { generate } from 'shortid';
import { Board, IBoard } from '../models/board.model';

@injectable()
export class BoardService {
  create(userId: string, payload: {
    name: string
  }) {
    const boardId = `board_${generate()}`;
    return new Board({
      name: payload.name,
      boardId,
      userId,
    }).save();
  }

  fetchAll(findQuery: FilterQuery<IBoard>) {
    return Board.find(findQuery);
  }

  deleteOne(findQuery: FilterQuery<IBoard>) {
    return Board.deleteOne(findQuery);
  }
}
