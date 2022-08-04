import * as request from 'supertest';
import { emptyDB, findOneByQuery } from '../seed';
import { server } from '../main.spec';
import axios from 'axios';

import config from '../../src/config';
import { Types } from 'mongoose';
import { REQUEST_TYPE } from '../../src/config/enums';
import { arraysAreIdentical } from '../utils';

const requestsCollectionName = config.mongo.requestCollectionName;
const groupsCollectionName = config.mongo.groupCollectionName;

export const testChangeClearance = () => {
    describe('Change clearance useCases', () => {

        beforeAll(async () => {
            await emptyDB();
        })

        it('Valid change clearance request without approvals', async () => {
            let reqCreateBody = {
                name: 'RoeiGroup',
                types: ['distribution'],
                clearance: 'None',
                applicant: '507f1f77bcf86cd799439011',
            };

            let res = await request(server.app).post(`/api/requests/create`).send(reqCreateBody).expect(200);

            await request(server.app).post(`/api/executedRequest/${res.body.requestNumber}`).send({}).expect(200);

            let foundCreatedGroup = await findOneByQuery(groupsCollectionName, {
                name: reqCreateBody.name,
            });

            expect(foundCreatedGroup.clearance).toBe(reqCreateBody.clearance);

            const groupId = foundCreatedGroup._id.toString();

            let changeClearanceReqBody = {
                groupId,
                clearance: 'Secret',
                applicant: '507f1f77bcf86cd799439011'
            }

            res = await request(server.app).post(`/api/requests/changeClearance`).send(changeClearanceReqBody).expect(200);

            let insertedChangeClearanceRequest = await findOneByQuery(requestsCollectionName, {
                requestNumber: res.body.requestNumber
            });

            expect(insertedChangeClearanceRequest).toBeTruthy();
            expect(insertedChangeClearanceRequest.clearance).toBe(changeClearanceReqBody.clearance);

            await request(server.app).post(`/api/executedRequest/${res.body.requestNumber}`).send({}).expect(200);

            foundCreatedGroup = await findOneByQuery(groupsCollectionName, {
                name: reqCreateBody.name,
            });

            expect(foundCreatedGroup.clearance).toBe(changeClearanceReqBody.clearance);
        })

    })
}