import { Container } from 'inversify';
import TYPES from './types';
import { AuthService } from './services/auth.service';
import { BoardService } from './services/board.service';
import { ColumnService } from './services/column.service';

const container = new Container();

container.bind<AuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();
container.bind<BoardService>(TYPES.BoardService).to(BoardService).inSingletonScope();
container.bind<ColumnService>(TYPES.ColumnService).to(ColumnService).inSingletonScope();

export default container;
