import { Response } from 'express';
import { inject } from 'inversify';
import {
  controller, httpDelete, httpPost, interfaces, request, response,
} from 'inversify-express-utils';
import { authMiddleware } from '../middlewares/auth.middleware';
import TYPES from '../types';
import { ColumnService } from '../services/column.service';
import { RequestWithContext } from '../types/request.type';

@controller('/cards', authMiddleware())
export class CardController implements interfaces.Controller {
  constructor(
    @inject(TYPES.ColumnService) private readonly columnService: ColumnService,
  ) { }

  @httpPost('/')
  async create(@request() req: RequestWithContext, @response() res: Response) {
    const { title, description, columnId } = req.body;
    try {
      if (!title) {
        throw Error('Title is mandatory');
      }
      const card = await this.columnService.create(columnId, {
        title,
        description,
      });
      res.status(201).json(card);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  @httpDelete('/:columnId')
  async delteOne(@request() req: RequestWithContext, @response() res: Response) {
    try {
      const { cardId } = req.params;
      await this.columnService.delete(cardId);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
