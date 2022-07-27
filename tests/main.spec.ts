import { testExecutedRequests } from './requests/executedRequest.spec';
import { modelsMap } from './../src/mongo/models/request.model';
import groupModel from './../src/mongo/models/group.model';
/* eslint-disable import/no-mutable-exports */
/* eslint-disable import/prefer-default-export */
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Server from '../src/express/app';
import config from '../src/config';
import initializeMongo from '../src/mongo/initializeMongo';
import { emptyDB } from './seed';
import RequestRepo from '../src/mongo/repo/request.repo';
import GroupRepo from '../src/mongo/repo/group.repo';
import RequestUseCases from '../src/useCases/request.useCases';
import GroupService from '../src/services/group/group.service';
import ExecutedRequestUseCases from '../src/useCases/executedRequest.useCases';
import RequestController from '../src/express/controllers/request.controller';
import ExecutedRequestController from '../src/express/controllers/executedRequest.controller';
import RequestRouter from '../src/express/routes/request.route';
import ExecutedRequestRouter from '../src/express/routes/executedRequest.route';
import { testCreateGroup } from './requests/createGroup.spec';
import { testApprovalRounds } from './requests/approveRounds.spec';
import { testAddDisToGroup } from './requests/disToGroup.spec';
import { testGroupUseCases } from './groups/get.spec';
import GroupUseCases from '../src/useCases/group.useCases';
import GroupController from '../src/express/controllers/group.controller';
import GroupRouter from '../src/express/routes/group.route';
import KartoffelService from '../src/services/kartoffel.service';
import { testEntitiesToGroup } from './requests/entitiesToGroup.spec';
import { testRenameGroup } from './requests/rename.spec';

export let server: Server;
let replset: MongoMemoryReplSet;
let uri: string;

beforeAll(async () => {
    try {
        console.log(`Starting testing...`);
        const requestRepo = new RequestRepo(modelsMap);
        const groupRepo = new GroupRepo(groupModel);

        const requestService = new RequestUseCases(requestRepo, groupRepo);
        const kartoffelService = new KartoffelService(config.kartoffel.baseURL);
        const groupService = new GroupService(groupRepo, kartoffelService);
        const executedRequestService = new ExecutedRequestUseCases(requestRepo, groupService);
        const groupUseCases = new GroupUseCases(groupRepo);

        const requestController = new RequestController(requestService);
        const executedRequestController = new ExecutedRequestController(executedRequestService);
        const groupController = new GroupController(groupUseCases);

        // const auth = new Auth(userService.auth);

        const requestRouter = new RequestRouter(requestController);
        const executedRequestRouter = new ExecutedRequestRouter(executedRequestController);
        const groupsRouter = new GroupRouter(groupController);

        server = new Server(config.server.port, [requestRouter, executedRequestRouter, groupsRouter]);

        try {
            replset = new MongoMemoryReplSet({
                replSet: {
                    name: 'rs0',
                    dbName: 'friesTest',
                    storageEngine: 'wiredTiger',
                    count: 1,
                },
            });

            await replset.waitUntilRunning();
            // uri = replset.getUri();
        } catch (err) {
            await replset.start();
            await replset.waitUntilRunning();
        }

        uri = replset.getUri();

        await initializeMongo(uri);
        await emptyDB();
        // await seedDB();
        console.log('Testing environment is on!');
    } catch (err) {
        console.log(err);
        await replset.stop();
    }
});

describe('Run all tests', () => {
    jest.setTimeout(3 * 60 * 1000);
    testCreateGroup();
    testApprovalRounds();
    testAddDisToGroup();
    testExecutedRequests();
    testGroupUseCases();
    testEntitiesToGroup();
    testRenameGroup();
});

afterAll(async () => {
    await server.stop();
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await replset.stop();
});
