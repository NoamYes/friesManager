import * as request from 'supertest';
import config from '../../src/config';
import { REQUEST_STATUS, REQUEST_TYPE } from '../../src/config/enums';
import { server } from '../main.spec';
import { emptyDB, findOneByQuery } from '../seed';

const requestsCollectionName = config.mongo.requestCollectionName;

export const testCreateGroup = () => {

    beforeEach(async () => {
        await emptyDB();
    })

    describe('Create create group requests useCases', () => {
        it('Valid Create Group Request Without Approvals', async () => {

            const reqBody = {
                type: REQUEST_TYPE.CREATE_GROUP,
                name: "RoeiGroup",
                types: ["distribution"],
                applicant: "507f1f77bcf86cd799439011"
            }

            const res = await request(server.app).post(`/api/requests`).send(reqBody);
            expect(res.status).toBe(200);

            const insertedCreateGroupRequest = (await findOneByQuery(requestsCollectionName, {
                name: reqBody.name
            }));

            expect(insertedCreateGroupRequest).toBeTruthy();
        })

        it('Valid Create Group Request With Approvals', async () => {
            const reqBody = {
                type: REQUEST_TYPE.CREATE_GROUP,
                name: "GroupWithApprovals",
                types: ["distribution"],
                applicant: "507f1f77bcf86cd799439011",
                approvalsNeeded: [
                    {
                        authorityId: "123456789",
                        approvalType: "entity"
                    },
                    {
                        authorityId: "987654321",
                        approvalType: "entity"
                    }
                ]
            }

            const res = await request(server.app).post(`/api/requests`).send(reqBody);
            expect(res.status).toBe(200);


            let insertedCreateGroupRequest;

            insertedCreateGroupRequest = (await findOneByQuery(requestsCollectionName, {
                name: reqBody.name
            }));

            expect(insertedCreateGroupRequest.approvalRounds.length).toBe(2);
            expect(insertedCreateGroupRequest.status).toBe(REQUEST_STATUS.WAITING_FOR_APPROVALS);
        }

        )
    })

    // TODO: test - create group with approval rounds
}