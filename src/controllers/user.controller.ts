import { Request, Response } from 'express';
import { inject } from 'inversify';
import {
  interfaces, controller, request, response, httpPost, httpGet,
} from 'inversify-express-utils';
import { decode } from 'jsonwebtoken';
import { BoardService } from '../services/board.service';
import { RequestWithContext } from '../types/request.type';
import { AuthService } from '../services/auth.service';
import TYPES from '../types';
import { authMiddleware } from '../middlewares/auth.middleware';

@controller('/auth')
export class AuthController implements interfaces.Controller {
  constructor(
    @inject(TYPES.AuthService) readonly authService: AuthService,
    @inject(TYPES.BoardService) readonly boardService: BoardService,
  ) { }

  @httpGet('/me', authMiddleware())
  public async me(@request() req: RequestWithContext, @response() res: Response) {
    return res.send(req.user);
  }

  @httpPost('/register')
  public async signup(@request() req: Request, @response() res: Response) {
    const { username, email, password } = req.body;
    try {
      if (!username) {
        throw Error('Name is mandatory');
      }
      if (!email) {
        throw Error('Email is mandatory');
      }
      if (!password) {
        throw Error('Password is mandatory');
      }
      const user = await this.authService.create({
        username,
        email,
        password,
      });
      this.boardService.create(user.userId, {
        name: 'Today',
      });
      res.status(201).json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  @httpPost('/verify')
  public async login(@request() req: Request, @response() res: Response) {
    const { email, password } = req.body;
    try {
      if (!email) {
        throw Error('Email is mandatory');
      }
      if (!password) {
        throw Error('Password is mandatory');
      }
      const verifiedResponse = await this.authService.verify({
        email,
        password,
      });
      res.cookie('accessToken', verifiedResponse.accessToken, {
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(200).json({ accessToken: verifiedResponse.accessToken });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  @httpPost('/refreshtoken')
  public async refreshToken(@request() req: RequestWithContext, @response() res: Response) {
    const bearer = req.headers.authorization;
    try {
      if (!bearer) {
        throw new Error('Invalid access token');
      }
      const token = bearer.split(' ')[1];
      const decodedToken: any = decode(token);
      if (!decodedToken) {
        throw new Error('Invalid access token');
      }
      const accessToken = await this.authService.refresh(decodedToken.userId);
      res.cookie('accessToken', accessToken, {
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(200).send({ accessToken });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
}
