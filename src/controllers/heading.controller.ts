
import { Response } from 'express';
import { inject } from 'inversify';
import {
  controller, httpDelete, httpPatch, httpPost, interfaces, request, response,
} from 'inversify-express-utils';
import { authMiddleware } from '../middlewares/auth.middleware';
import TYPES from '../types';
import { RequestWithContext } from '../types/request.type';
import { HeadingService } from '../services/heading.service';

@controller('/heading', authMiddleware())
export class HeadingController implements interfaces.Controller {
  constructor(
    @inject(TYPES.HeadingService) private readonly headingService: HeadingService,
  ) { }

  @httpPost('/')
  async create(@request() req: RequestWithContext, @response() res: Response) {
    const { title, columnId } = req.body;
    try {
      if (!title) {
        throw Error('Title is mandatory');
      }
      const card = await this.headingService.create(columnId, {
        title,
      });
      res.status(201).json(card);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // @httpPatch('/:headingId')
  // async updateOne(@request() req: RequestWithContext, @response() res: Response) {
  // }
  //
  // @httpPatch('/:headingId/move')
  // async moveOne(@request() req: RequestWithContext, @response() res: Response) {
  // }
  //
  // @httpDelete('/:headingId')
  // async delete(@request() req: RequestWithContext, @response() res: Response) {
  // }
}
