import 'reflect-metadata';
import express, { Application } from 'express';
import cors from 'cors';
import { InversifyExpressServer } from 'inversify-express-utils';
import mongoose from 'mongoose';
import container from './inversify.cofig';
import './controllers/index.controller';

/**
 *
 *
 * @class Server
 */
class Server {
  /**
   *
   *
   * @private
   * @type {(string | number)}
   * @memberof Server
   */
  private port: string | number;

  /**
   *
   *
   * @private
   * @type {Application}
   * @memberof Server
   */
  private app: Application;

  /**
   *
   *
   * @memberof Server
   */
  public async init() {
    this.confgure();
    await this.setup();
    this.listen();
  }

  /**
   *
   *
   * @private
   * @memberof Server
   */
  private confgure() {
    this.configurePort();
  }

  /**
   *
   *
   * @private
   * @memberof Server
   */
  private configurePort() {
    this.port = process.env.PORT || 4000;
  }

  /**
   *
   *
   * @private
   * @memberof Server
   */
  private async setup() {
    this.createExpressApplication();
    await this.connectToDb();
  }

  /**
   *
   *
   * @private
   * @memberof Server
   */
  private createExpressApplication() {
    const app = express();
    app.use(express.json());
    app.use(cors({
      credentials: true,
      origin: 'http://localhost:3001',
    }));
    const server = new InversifyExpressServer(container, null, { rootPath: '/api' }, app);
    this.app = server.build();
  }

  private async connectToDb() {
    const MONGO_URI = 'mongodb://127.0.0.1:27017/checklist?compressors=zlib';
    await mongoose.connect(MONGO_URI);
  }

  /**
   *
   *
   * @private
   * @memberof Server
   */
  private listen() {
    const { port } = this;
    this.app.listen(port, () => `Server running ${port}`);
  }
}

/**
 *
 *
 */
const bootstrap = async () => {
  const server = new Server();
  server.init();
};

bootstrap();
