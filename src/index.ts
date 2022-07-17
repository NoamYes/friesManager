import RequestRepo from './mongo/repo/request.repo';
import initializeMongo from './mongo/initializeMongo';
import App from './express/app';
import config from './config';
import { modelsMap } from './mongo/models/request.model';
import RequestService from './services/request.service';
import RequestController from './express/controllers/request.controller';
import RequestRouter from './express/routes/request.route';
// import Auth from './services/auth.service';

const { mongo } = config;

/**
 * The main function.
 * Calls all the initialization functions.
 */
const main = async () => {
    await initializeMongo(mongo.uri);

    const requestRepo = new RequestRepo(modelsMap);

    const requestService = new RequestService(requestRepo);

    const requestController = new RequestController(requestService);

    // const auth = new Auth(userService.auth);

    const requestRouter = new RequestRouter(requestController);

    const port = config.server.port;
    new App(port, [requestRouter]);
};

main().catch((err) => {
    console.log(err);
    process.exit();
});
