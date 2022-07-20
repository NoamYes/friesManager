import { Types } from 'mongoose';
import * as request from 'supertest';
import config from '../../src/config';
import { APPROVAL_ROUND_STATUS, REQUEST_STATUS } from '../../src/config/enums';
import { server } from '../main.spec';
import { emptyDB, findOneByQuery } from '../seed';
import { arraysAreIdentical } from '../utils';

const requestsCollectionName = config.mongo.requestCollectionName;
const groupsCollectionName = config.mongo.groupCollectionName;

export const testExecutedRequests = () => {
    const groupWithApprovalsBody = {
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

    describe('Create group after approved and executed post', () => {
        beforeEach(async () => {
            await emptyDB();
        });

        it('2 approval Rounds of create group request and then create group', async () => {
            const res = await request(server.app).post(`/api/requests/createGroup`).send(groupWithApprovalsBody);
            expect(res.status).toBe(200);

            let insertedCreateGroupRequest;

            await request(server.app)
                .put(`/api/requests/approve/${res.body.requestNumber}`)
                .send({
                    authorityId: '123456789',
                    approved: true,
                })
                .expect(200);

            insertedCreateGroupRequest = await findOneByQuery(requestsCollectionName, {
                name: groupWithApprovalsBody.name,
            });

            expect(insertedCreateGroupRequest.approvalRounds[0].status).toBe(APPROVAL_ROUND_STATUS.APPROVED);
            expect(insertedCreateGroupRequest.status).toBe(REQUEST_STATUS.WAITING_FOR_APPROVALS);

            await request(server.app)
                .put(`/api/requests/approve/${res.body.requestNumber}`)
                .send({
                    authorityId: '987654321',
                    approved: true,
                })
                .expect(200);

            insertedCreateGroupRequest = await findOneByQuery(requestsCollectionName, {
                name: groupWithApprovalsBody.name,
            });

            expect(insertedCreateGroupRequest.approvalRounds[1].status).toBe(APPROVAL_ROUND_STATUS.APPROVED);
            expect(insertedCreateGroupRequest.status).toBe(REQUEST_STATUS.IN_PROCESS);

            const requestNumber = insertedCreateGroupRequest.requestNumber;
            expect(requestNumber).toBe(1);
            const resExecuted = await request(server.app).post(`/api/executedRequest/${requestNumber}`).send({});
            expect(resExecuted.status).toBe(200);
            let foundCreatedGroup = await findOneByQuery(groupsCollectionName, {
                name: insertedCreateGroupRequest.name,
            });

            expect(foundCreatedGroup.name).toBe(insertedCreateGroupRequest.name);
        });

        it('2 approval Rounds of add addDiGoup request and then add dis to group', async () => {
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

            let resExecuted = await request(server.app).post(`/api/executedRequest/${insertedCreateGroupRequest.requestNumber}`).send({});
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
            expect(insertedAddDIsRequest.requestNumber).toBe(2);

            resExecuted = await request(server.app).post(`/api/executedRequest/${insertedAddDIsRequest.requestNumber}`).send({});
            expect(resExecuted.status).toBe(200);

            foundCreatedGroup = await findOneByQuery(groupsCollectionName, {
                name: reqCreateBody.name,
            });
            expect(arraysAreIdentical(foundCreatedGroup.dis, reqAddBody.disUniqueId)).toBeTruthy();
        });
    });
};
