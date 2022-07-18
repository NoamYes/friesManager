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
import RequestService from '../src/services/request.service';
import GroupService from '../src/services/group/group.service';
import ExecutedRequestService from '../src/services/executedRequest.service';
import RequestController from '../src/express/controllers/request.controller';
import ExecutedRequestController from '../src/express/controllers/executedRequest.controller';
import RequestRouter from '../src/express/routes/request.route';
import ExecutedRequestRouter from '../src/express/routes/executedRequest.route';
import { testCreateGroup } from './requests/createGroup.spec';
import { testApprovalRounds } from './requests/approveRounds.spec';
import { testAddDisToGroup } from './requests/addDisToGroup.spec';

export let server: Server;
let replset: MongoMemoryReplSet;
let uri: string;

beforeAll(async () => {
    try {
        console.log(`Starting testing...`);
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

        server = new Server(config.server.port, [requestRouter, executedRequestRouter]);

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
});

afterAll(async () => {
    await server.stop();
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await replset.stop();
});
