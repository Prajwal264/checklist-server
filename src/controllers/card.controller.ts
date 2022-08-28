import { Response } from 'express';
import { inject } from 'inversify';
import {
  controller, httpDelete, httpPost, interfaces, request, response,
} from 'inversify-express-utils';
import { CardService } from '../services/card.service';
import { authMiddleware } from '../middlewares/auth.middleware';
import TYPES from '../types';
import { RequestWithContext } from '../types/request.type';

@controller('/cards', authMiddleware())
export class CardController implements interfaces.Controller {
  constructor(
    @inject(TYPES.CardService) private readonly cardService: CardService,
  ) { }

  @httpPost('/')
  async create(@request() req: RequestWithContext, @response() res: Response) {
    const { title, checked, columnId } = req.body;
    try {
      if (!title) {
        throw Error('Title is mandatory');
      }
      const card = await this.cardService.create(columnId, {
        title,
        checked,
      });
      res.status(201).json(card);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  @httpDelete('/:cardId')
  async delteOne(@request() req: RequestWithContext, @response() res: Response) {
    try {
      const { cardId } = req.params;
      await this.cardService.delete(cardId);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
