import * as request from 'supertest';
import { emptyDB, findOneByQuery } from '../seed';
import { server } from '../main.spec';

import config from '../../src/config';
import { Types } from 'mongoose';

const requestsCollectionName = config.mongo.requestCollectionName;
const groupsCollectionName = config.mongo.groupCollectionName;

export const testAddDisToGroup = () => {
    beforeEach(async () => {
        await emptyDB();
    });

    describe('Add Dis to group useCases', () => {
        it('Valid add Dis to group requests without approvals', async () => {
            let reqCreateBody = {
                name: 'RoeiGroup',
                types: ['distribution'],
                applicant: '507f1f77bcf86cd799439011',
            };

            let res = await request(server.app).post(`/api/requests/createGroup`).send(reqCreateBody);
            expect(res.status).toBe(200);

            let insertedCreateGroupRequest = await findOneByQuery(requestsCollectionName, {
                name: reqCreateBody.name,
            });

            const resExecuted = await request(server.app).post(`/api/executedRequest/executed/${insertedCreateGroupRequest.requestNumber}`).send({});
            expect(resExecuted.status).toBe(200);

            let foundCreatedGroup = await findOneByQuery(groupsCollectionName, {
                name: reqCreateBody.name,
            });

            let reqAddBody = {
                groupId: foundCreatedGroup._id.toString(),
                disUniqueId: ['a', 'b'],
                applicant: '507f1f77bcf86cd799439011',
            };

            res = await request(server.app).post(`/api/requests/addDisToGroup`).send(reqAddBody);
            expect(res.status).toBe(200);

            let insertedAddDIsRequest = await findOneByQuery(requestsCollectionName, {
                groupId: new Types.ObjectId(reqAddBody.groupId),
            });

            expect(insertedAddDIsRequest).toBeTruthy();
            expect(insertedAddDIsRequest.disUniqueId.length).toBe(reqAddBody.disUniqueId.length);
        });
    });
};
