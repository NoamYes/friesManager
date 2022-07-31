import { Types } from 'mongoose';
import * as request from 'supertest';
import config from '../../src/config';
import { REQUEST_STATUS, REQUEST_TYPE } from '../../src/config/enums';
import { server } from '../main.spec';
import { emptyDB, findOneByQuery } from '../seed';

const groupsCollectionName = config.mongo.groupCollectionName;
const requestsCollectionName = config.mongo.requestCollectionName;

export const testRenameGroup = () => {
    describe('Rename Group useCases', () => {

        beforeEach(async () => {
            await emptyDB();
        });

        const reqCreateBody = {
            name: 'RoeiGroup',
            types: ['distribution'],
            applicant: '507f1f77bcf86cd799439011',
        }

        const newName = 'OrenGroup';

        it('Valid Rename Request', async () => {

            let res = await request(server.app).post(`/api/requests/create`).send(reqCreateBody).expect(200);

            await request(server.app).post(`/api/executedRequest/${res.body.requestNumber}`).send({}).expect(200);

            let foundCreatedGroup = await findOneByQuery(groupsCollectionName, {
                name: reqCreateBody.name,
            });

            const groupId = foundCreatedGroup._id.toString();

            let renameReqBody = {
                groupId,
                name: newName,
                applicant: '507f1f77bcf86cd799439011',
            };

            res = await request(server.app).post(`/api/requests/rename`).send(renameReqBody).expect(200);

            let insertedRenameRequest = await findOneByQuery(requestsCollectionName, {
                requestNumber: res.body.requestNumber
            });

            expect(insertedRenameRequest.type).toBe(REQUEST_TYPE.RENAME);
            expect(insertedRenameRequest.groupId.toString()).toBe(groupId);
            expect(insertedRenameRequest.name).toBe(newName);

            await request(server.app).post(`/api/executedRequest/${res.body.requestNumber}`).send({}).expect(200);

            foundCreatedGroup = await findOneByQuery(groupsCollectionName, {
                _id: new Types.ObjectId(groupId),
            });

            expect(foundCreatedGroup.name).toBe(newName);

        })

        it('Invalid Rename Request - name already exists', async () => {

            let res = await request(server.app).post(`/api/requests/create`).send(reqCreateBody).expect(200);

            await request(server.app).post(`/api/executedRequest/${res.body.requestNumber}`).send({}).expect(200);

            let reqCreateBody2 = {
                name: newName,
                types: ['distribution'],
                applicant: '507f1f77bcf86cd799439011',
            }

            res = await request(server.app).post(`/api/requests/create`).send(reqCreateBody2).expect(200);

            await request(server.app).post(`/api/executedRequest/${res.body.requestNumber}`).send({}).expect(200);

            let foundFirstCreatedGroup = await findOneByQuery(groupsCollectionName, {
                name: reqCreateBody.name,
            });

            const groupId = foundFirstCreatedGroup._id.toString();

            let renameReqBody = {
                groupId,
                name: newName,
                applicant: '507f1f77bcf86cd799439011',
            };

            await request(server.app).post(`/api/requests/rename`).send(renameReqBody).expect(400);

        })

    })
}