import * as request from 'supertest';
import config from '../../src/config';
import { REQUEST_STATUS } from '../../src/config/enums';
import { server } from '../main.spec';
import { emptyDB, findOneByQuery } from '../seed';

const requestsCollectionName = config.mongo.requestCollectionName;

export const testCreateGroup = () => {
    beforeEach(async () => {
        await emptyDB();
    });

    describe('Create create group requests useCases', () => {
        it('Valid Create Group Request Without Approvals', async () => {
            const reqBody = {
                name: 'RoeiGroup',
                types: ['distribution'],
                applicant: '507f1f77bcf86cd799439011',
            };

            const res = await request(server.app).post(`/api/requests/createGroup`).send(reqBody);
            expect(res.status).toBe(200);

            const insertedCreateGroupRequest = await findOneByQuery(requestsCollectionName, {
                name: reqBody.name,
            });

            expect(insertedCreateGroupRequest).toBeTruthy();
            expect(insertedCreateGroupRequest.name).toBe(reqBody.name);
            expect(insertedCreateGroupRequest.types.length).toBe(reqBody.types.length);
            expect(insertedCreateGroupRequest.requestNumber).toBe(1);
        });

        it('Valid Create Group Request With Approvals', async () => {
            const reqBody = {
                name: 'GroupWithApprovals',
                types: ['distribution'],
                applicant: '507f1f77bcf86cd799439011',
                approvalsNeeded: [
                    {
                        authorityId: '507f1f77bcf86cd799439011',
                        approvalType: 'entity',
                    },
                    {
                        authorityId: '507f1f77bcf86cd799438011',
                        approvalType: 'entity',
                    },
                ],
            };

            const res = await request(server.app).post(`/api/requests/createGroup`).send(reqBody);
            expect(res.status).toBe(200);

            let insertedCreateGroupRequest;

            insertedCreateGroupRequest = await findOneByQuery(requestsCollectionName, {
                name: reqBody.name,
            });

            expect(insertedCreateGroupRequest.approvalRounds.length).toBe(2);
            expect(insertedCreateGroupRequest.status).toBe(REQUEST_STATUS.WAITING_FOR_APPROVALS);
        });
    });
};
