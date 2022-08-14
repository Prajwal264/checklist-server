import { Response } from 'express';
import { inject } from 'inversify';
import {
  controller, httpPost, interfaces, request, response,
} from 'inversify-express-utils';
import { authMiddleware } from '../middlewares/auth.middleware';
import TYPES from '../types';
import { BoardService } from '../services/board.service';
import { RequestWithContext } from '../types/request.type';

@controller('/boards', authMiddleware())
export class BoardController implements interfaces.Controller {
  constructor(
    @inject(TYPES.BoardService) readonly boardService: BoardService,
  ) {}

    @httpPost('/')
  async create(@request() req: RequestWithContext, @response() res: Response) {
    const { name } = req.body;
    try {
      if (!name) {
        throw Error('Name is mandatory');
      }
      const { userId } = req.user;
      await this.boardService.create(userId, {
        name,
      });
      res.status(201).json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
