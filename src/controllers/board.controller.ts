import { Response } from 'express';
import { inject } from 'inversify';
import {
  controller, httpDelete, httpGet, httpPost, interfaces, request, response,
} from 'inversify-express-utils';
import { authMiddleware } from '../middlewares/auth.middleware';
import TYPES from '../types';
import { BoardService } from '../services/board.service';
import { RequestWithContext } from '../types/request.type';

@controller('/boards', authMiddleware())
export class BoardController implements interfaces.Controller {
  constructor(
    @inject(TYPES.BoardService) readonly boardService: BoardService,
  ) { }

  @httpGet('/')
  async fetchAll(@request() req: RequestWithContext, @response() res: Response) {
    try {
      const { userId } = req.user;
      const boards = await this.boardService.fetchAll({ userId });
      res.status(200).json(boards);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  @httpPost('/')
  async create(@request() req: RequestWithContext, @response() res: Response) {
    const { name } = req.body;
    try {
      if (!name) {
        throw Error('Name is mandatory');
      }
      const { userId } = req.user;
      const board = await this.boardService.create(userId, {
        name,
      });
      res.status(201).json(board);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  @httpDelete('/:boardId')
  async delete(@request() req: RequestWithContext, @response() res: Response) {
    const { userId } = req.user;
    const { boardId } = req.params;
    try {
      await this.boardService.deleteOne({ creatorId: userId, boardId });
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
