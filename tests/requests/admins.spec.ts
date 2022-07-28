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

export const testAdminsToGroup = () => {

    describe.only('Admins to Group', () => {
        beforeAll(async () => {
            emptyDB();
        })

        let adminsToAdd = ['615af7afd64f5fdea26daf15', '507f1f77bcf86cd799438011'];
        let adminsToRemove = ['615af7afd64f5fdea26daf15'];

        let reqCreateBody = {
            name: 'RoeiGroup',
            types: ['distribution'],
            applicant: '507f1f77bcf86cd799439011',
        };

        let groupId: string;

        it('Valid Add Admins requests without approvals', async () => {
            let res = await request(server.app).post(`/api/requests/create`).send(reqCreateBody).expect(200);

            await request(server.app).post(`/api/executedRequest/${res.body.requestNumber}`).send({}).expect(200);

            let foundCreatedGroup = await findOneByQuery(groupsCollectionName, {
                name: reqCreateBody.name,
            });

            groupId = foundCreatedGroup._id.toString();

            let reqAddBody = {
                groupId,
                adminsId: adminsToAdd,
                applicant: '507f1f77bcf86cd799439011',
            };

            res = await request(server.app).post(`/api/requests/addAdmins`).send(reqAddBody)
            expect(res.status).toBe(200);

            let insertedAddAdminsRequest = await findOneByQuery(requestsCollectionName, {
                requestNumber: res.body.requestNumber
            });

            expect(insertedAddAdminsRequest).toBeTruthy();
            expect(arraysAreIdentical(adminsToAdd, insertedAddAdminsRequest.adminsId)).toBeTruthy();

            await request(server.app).post(`/api/executedRequest/${res.body.requestNumber}`).send({}).expect(200);

            foundCreatedGroup = await findOneByQuery(groupsCollectionName, {
                name: reqCreateBody.name,
            });

            expect(arraysAreIdentical(foundCreatedGroup.admins, [...adminsToAdd, reqAddBody.applicant])).toBeTruthy();
        })

    })

}