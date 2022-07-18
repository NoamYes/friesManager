import { executedRequestSchema } from './express/joi/validator/executedRequests';
import RequestRepo from './mongo/repo/request.repo';
import GroupRepo from './mongo/repo/group.repo';
import initializeMongo from './mongo/initializeMongo';
import App from './express/app';
import config from './config';
import { modelsMap } from './mongo/models/request.model';
import groupModel from './mongo/models/group.model';
import RequestService from './services/request.service';
import GroupService from './services/group/group.service';
import RequestController from './express/controllers/request.controller';
import ExecutedRequestController from './express/controllers/executedRequest.controller';
import RequestRouter from './express/routes/request.route';
import ExecutedRequestService from './services/executedRequest.service';
import ExecutedRequestRouter from './express/routes/executedRequest.route';
// import Auth from './services/auth.service';

const { mongo } = config;

/**
 * The main function.
 * Calls all the initialization functions.
 */
const main = async () => {
    await initializeMongo(mongo.uri);

    const requestRepo = new RequestRepo(modelsMap);
    const groupRepo = new GroupRepo(groupModel);

    const requestService = new RequestService(requestRepo);
    const groupService = new GroupService(groupRepo);
    const executedRequestService = new ExecutedRequestService(requestRepo, groupService);

    const requestController = new RequestController(requestService);
    const executedRequestController = new ExecutedRequestController(executedRequestService);

    // const auth = new Auth(userService.auth);

    const requestRouter = new RequestRouter(requestController);
    const executedRequestRouter = new ExecutedRequestRouter(executedRequestController);

    const port = config.server.port;
    new App(port, [requestRouter, executedRequestRouter]);
};

main().catch((err) => {
    console.log(err);
    process.exit();
});
