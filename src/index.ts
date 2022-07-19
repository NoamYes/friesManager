import RequestRepo from './mongo/repo/request.repo';
import GroupRepo from './mongo/repo/group.repo';
import initializeMongo from './mongo/initializeMongo';
import App from './express/app';
import config from './config';
import { modelsMap } from './mongo/models/request.model';
import groupModel from './mongo/models/group.model';
import RequestUseCases from './useCases/request.useCases';
import GroupService from './services/group/group.service';
import RequestController from './express/controllers/request.controller';
import ExecutedRequestController from './express/controllers/executedRequest.controller';
import RequestRouter from './express/routes/request.route';
import ExecutedRequestUseCases from './useCases/executedRequest.useCases';
import ExecutedRequestRouter from './express/routes/executedRequest.route';
import GroupRouter from './express/routes/group.route';
import GroupUseCases from './useCases/group.useCases';
import GroupController from './express/controllers/group.controller';
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

    const requestUseCases = new RequestUseCases(requestRepo);
    const groupService = new GroupService(groupRepo);
    const executedRequestUseCases = new ExecutedRequestUseCases(requestRepo, groupService);
    const groupUseCases = new GroupUseCases(groupRepo);

    const requestController = new RequestController(requestUseCases);
    const executedRequestController = new ExecutedRequestController(executedRequestUseCases);
    const groupController = new GroupController(groupUseCases);

    // const auth = new Auth(userService.auth);

    const requestRouter = new RequestRouter(requestController);
    const executedRequestRouter = new ExecutedRequestRouter(executedRequestController);
    const groupsRouter = new GroupRouter(groupController);

    const port = config.server.port;
    new App(port, [requestRouter, executedRequestRouter, groupsRouter]);
};

main().catch((err) => {
    console.log(err);
    process.exit();
});
