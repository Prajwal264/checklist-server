import { Container } from 'inversify';
import TYPES from './types';
import { AuthService } from './services/auth.service';
import { BoardService } from './services/board.service';

const container = new Container();

container.bind<AuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();
container.bind<BoardService>(TYPES.BoardService).to(BoardService).inSingletonScope();

export default container;
