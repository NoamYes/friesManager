import * as request from 'supertest';
import { emptyDB, findOneByQuery } from "../seed";
import { server } from '../main.spec';

import config from "../../src/config";
import { Types } from 'mongoose';

const requestsCollectionName = config.mongo.requestCollectionName;

export const testAddDisToGroup = () => {

    beforeEach(async () => {
        await emptyDB();
    })

    describe('Add Dis to group useCases', () => {
        it('Valid add Dis to group requests without approvals', async () => {

            const reqBody = {
                groupId: "507f1f77bcf86cd799439011",
                disUniqueId: ["a", "b"],
                applicant: "507f1f77bcf86cd799439011",
            }

            const res = await request(server.app).post(`/api/requests/addDisToGroup`).send(reqBody);
            expect(res.status).toBe(200);

            const insertedCreateGroupRequest = (await findOneByQuery(requestsCollectionName, {
                groupId: new Types.ObjectId(reqBody.groupId)
            }));

            expect(insertedCreateGroupRequest).toBeTruthy();
            expect(insertedCreateGroupRequest.disUniqueId.length).toBe(reqBody.disUniqueId.length);
        })
    })

}