import * as request from 'supertest';
import { emptyDB, findOneByQuery } from '../seed';
import { server } from '../main.spec';

import config from '../../src/config';
import { Types } from 'mongoose';
import { arraysAreIdentical } from '../utils';
import { REQUEST_TYPE } from '../../src/config/enums';

const requestsCollectionName = config.mongo.requestCollectionName;
const groupsCollectionName = config.mongo.groupCollectionName;

export const testAddDisToGroup = () => {
    describe('Dis to group useCases', () => {

        beforeAll(async () => {
            await emptyDB();
        });

        let reqCreateBody = {
            name: 'RoeiGroup',
            types: ['distribution'],
            applicant: '507f1f77bcf86cd799439011',
        };

        const addDisUniqueId = ['a', 'b'];
        const removeDisUniqueId = ['a'];

        let groupId: string;

        it('Valid add Dis to group requests without approvals', async () => {

            let res = await request(server.app).post(`/api/requests/createGroup`).send(reqCreateBody);
            expect(res.status).toBe(200);

            let insertedCreateGroupRequest = await findOneByQuery(requestsCollectionName, {
                name: reqCreateBody.name,
            });

            const resExecuted = await request(server.app).post(`/api/executedRequest/${insertedCreateGroupRequest.requestNumber}`).send({});
            expect(resExecuted.status).toBe(200);

            let foundCreatedGroup = await findOneByQuery(groupsCollectionName, {
                name: reqCreateBody.name,
            });

            groupId = foundCreatedGroup._id.toString();

            let reqAddBody = {
                groupId,
                disUniqueId: addDisUniqueId,
                applicant: '507f1f77bcf86cd799439011',
            };

            res = await request(server.app).post(`/api/requests/addDisToGroup`).send(reqAddBody);
            expect(res.status).toBe(200);

            let insertedAddDIsRequest = await findOneByQuery(requestsCollectionName, {
                groupId: new Types.ObjectId(groupId),
                type: REQUEST_TYPE.ADD_DIS_GROUP
            });

            expect(insertedAddDIsRequest).toBeTruthy();
            expect(insertedAddDIsRequest.disUniqueId.length).toBe(reqAddBody.disUniqueId.length);

            await request(server.app).post(`/api/executedRequest/${res.body.requestNumber}`).send({})

            foundCreatedGroup = await findOneByQuery(groupsCollectionName, {
                name: reqCreateBody.name,
            });

            expect(arraysAreIdentical(foundCreatedGroup.groupDis, addDisUniqueId)).toBeTruthy();
        });

        it('Valid remove dis from group without approvals', async () => {

            const reqBody = {
                groupId,
                disUniqueId: removeDisUniqueId,
                applicant: '507f1f77bcf86cd799439011'
            }

            const res = await request(server.app).post(`/api/requests/removeDisFromGroup`).send(reqBody).expect(200);
            const requestNumber = res.body.requestNumber;
            expect(requestNumber).toBeTruthy();

            let insertedRemoveDIsRequest = await findOneByQuery(requestsCollectionName, {
                groupId: new Types.ObjectId(groupId),
                type: REQUEST_TYPE.REMOVE_DIS_GROUP
            });

            expect(insertedRemoveDIsRequest).toBeTruthy();
            expect(arraysAreIdentical(insertedRemoveDIsRequest.disUniqueId, removeDisUniqueId)).toBeTruthy();

            await request(server.app).post(`/api/executedRequest/${requestNumber}`).send({}).expect(200);

            let group = await findOneByQuery(groupsCollectionName, { name: reqCreateBody.name });

            expect(arraysAreIdentical(group.groupDis, addDisUniqueId.filter(e => !removeDisUniqueId.includes(e)))).toBeTruthy();
        });
    });
};
