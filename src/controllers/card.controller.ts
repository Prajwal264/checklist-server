import { Response } from 'express';
import { inject } from 'inversify';
import {
  controller, httpPatch, httpPost, interfaces, request, response,
} from 'inversify-express-utils';
import { CardService, IMoveCardPayload } from '../services/card.service';
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

  @httpPatch('/:cardId')
  async updateOne(@request() req: RequestWithContext, @response() res: Response) {
    try {
      const { cardId } = req.params;
      const columnId = req.query.columnId as string;
      const { title, checked } = req.body;
      const updatedCard = await this.cardService.update({ cardId, columnId }, {
        title,
        checked,
      });
      res.status(200).json(updatedCard);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  @httpPatch('/:cardId/move')
  async moveOne(@request() req: RequestWithContext, @response() res: Response) {
    try {
      const payload: IMoveCardPayload = req.body;
      await this.cardService.move(payload);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
