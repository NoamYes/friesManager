import * as request from 'supertest';
import config from '../../src/config';
import { APPROVAL_ROUND_STATUS, REQUEST_STATUS } from '../../src/config/enums';
import { server } from '../main.spec';
import { emptyDB, findOneByQuery } from '../seed';

const requestsCollectionName = config.mongo.requestCollectionName;
const groupsCollectionName = config.mongo.groupCollectionName;

export const testExecutedRequests = () => {
    beforeEach(async () => {
        await emptyDB();
    });

    describe('Create group after approved and executed post', () => {
        it('2 approval Rounds of create group request and then create group', async () => {
            const reqBody = {
                name: 'GroupWithApprovals',
                types: ['distribution'],
                applicant: '507f1f77bcf86cd799439011',
                approvalsNeeded: [
                    {
                        authorityId: '123456789',
                        approvalType: 'entity',
                    },
                    {
                        authorityId: '987654321',
                        approvalType: 'entity',
                    },
                ],
            };

            const res = await request(server.app).post(`/api/requests/createGroup`).send(reqBody);
            expect(res.status).toBe(200);

            let insertedCreateGroupRequest;

            await request(server.app)
                .put(`/api/requests/approve/${res.body.id}`)
                .send({
                    authorityId: '123456789',
                    approved: true,
                })
                .expect(200);

            insertedCreateGroupRequest = await findOneByQuery(requestsCollectionName, {
                name: reqBody.name,
            });

            expect(insertedCreateGroupRequest.approvalRounds[0].status).toBe(APPROVAL_ROUND_STATUS.APPROVED);
            expect(insertedCreateGroupRequest.status).toBe(REQUEST_STATUS.WAITING_FOR_APPROVALS);

            await request(server.app)
                .put(`/api/requests/approve/${res.body.id}`)
                .send({
                    authorityId: '987654321',
                    approved: true,
                })
                .expect(200);

            insertedCreateGroupRequest = await findOneByQuery(requestsCollectionName, {
                name: reqBody.name,
            });

            expect(insertedCreateGroupRequest.approvalRounds[1].status).toBe(APPROVAL_ROUND_STATUS.APPROVED);
            expect(insertedCreateGroupRequest.status).toBe(REQUEST_STATUS.IN_PROCESS);

            const requestNumber = insertedCreateGroupRequest.requestNumber;
            expect(requestNumber).toBe(1);
            const resExecuted = await request(server.app).post(`/api/executedRequest/executed/${requestNumber}`).send({});
            expect(resExecuted.status).toBe(200);
            let foundCreatedGroup = await findOneByQuery(groupsCollectionName, {
                requestNumber: requestNumber,
            });

            expect(foundCreatedGroup.name).toBe(insertedCreateGroupRequest.name);
        });
    });
};
