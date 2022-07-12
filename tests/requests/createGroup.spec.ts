import * as request from 'supertest';
import config from '../../src/config';
import { server } from '../main.spec';
import { findOneByQuery } from '../seed';

const requestsCollectionName = config.mongo.requestCollectionName;

export const testCreateGroup = () => {
    describe('Create create group requests useCases', () => {
        it('Valid Create Group Request', async () => {

            const reqBody = {
                name: "RoeiGroup",
                types: ["distribution"],
                applicant: "507f1f77bcf86cd799439011"
            }

            const res = await request(server.app).post(`/api/requests/createGroup`).send(reqBody);
            expect(res.status).toBe(200);

            const insertedCreateGroupRequest = (await findOneByQuery(requestsCollectionName, {
                name: reqBody.name
            }));

            expect(insertedCreateGroupRequest).toBeTruthy();
        })
    })
}