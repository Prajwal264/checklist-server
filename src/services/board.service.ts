import { injectable } from 'inversify';
import { generate } from 'shortid';
import { Board } from '../models/board.model';

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
}
