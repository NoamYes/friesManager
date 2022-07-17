import * as express from 'express';
import * as logger from 'morgan';
import { errorMiddleware } from './error/errorMiddleware';
import { logInfo } from '../log/logger';
import * as cors from 'cors';
import IRouter from '../interfaces/router.interface';
import { Server } from 'http';

require('dotenv').config();

/**
 * Initializing the express server
 */
class App {
    private port: number;
    private _app: express.Application;
    private routers: IRouter[];
    private server: Server | undefined;

    constructor(port: number, routers: IRouter[]) {
        this.port = port;
        this.routers = routers;
        this._app = express();
        this.config();
        this.start();
    }

    get app(): express.Application {
        return this._app;
    }

    private config(): void {
        this._app.use(logger('dev'));
        this._app.use(cors({ origin: '*', credentials: true }));
        this._app.use(express.json());
        this._app.use(express.urlencoded({ extended: true }));
    }

    private initializeRouters(): void {
        this.routers.forEach((router) => {
            this._app.use(`/api${router.path}`, router.router);
        });
        this._app.use(errorMiddleware);
    }

    public async start(): Promise<void> {
        this.initializeRouters();
        this.server = this._app.listen(this.port, () => logInfo(`Server started on port ${this.port}`));
    }

    public async stop(): Promise<void> {
        this.server?.close();
    }

}

export default App;
