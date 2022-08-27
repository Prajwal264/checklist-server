import { Response } from 'express';
import { inject } from 'inversify';
import {
  controller, httpGet, httpPost, interfaces, request, response,
} from 'inversify-express-utils';
import { authMiddleware } from '../middlewares/auth.middleware';
import TYPES from '../types';
import { ColumnService } from '../services/column.service';
import { RequestWithContext } from '../types/request.type';

@controller('/columns', authMiddleware())
export class ColumnController implements interfaces.Controller {
  constructor(
    @inject(TYPES.ColumnService) private readonly columnService: ColumnService,
  ) { }

  @httpGet('/')
  async fetchAll(@request() req: RequestWithContext, @response() res: Response) {
    try {
      const { boardId } = req.query;
      const columns = await this.columnService.fetchAll({ boardId });
      res.status(200).json(columns);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  @httpPost('/')
  async create(@request() req: RequestWithContext, @response() res: Response) {
    const { title, description, boardId } = req.body;
    try {
      if (!title) {
        throw Error('Title is mandatory');
      }
      const column = await this.columnService.create(boardId, {
        title,
        description,
      });
      res.status(201).json(column);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
