import { findByQuery } from './../seed/index';
import * as request from 'supertest';
import { emptyDB, findOneByQuery } from "../seed";
import { server } from '../main.spec';

import config from "../../src/config";

const groupsCollection = config.mongo.groupCollectionName;

export const testGroupUseCases = () => {
    describe('GET Groups', () => {
        beforeAll(async () => {
            await emptyDB();

            let reqBody = {
                name: 'RoeiGroup',
                types: ['distribution'],
                applicant: '507f1f77bcf86cd799439011',
            };

            let res = await request(server.app).post(`/api/requests/createGroup`).send(reqBody);
            expect(res.status).toBe(200);

            reqBody = {
                name: 'RoeiGroup2',
                types: ['distribution'],
                applicant: '507f1f77bcf86cd799439011',
            }

            res = await request(server.app).post(`/api/requests/createGroup`).send(reqBody);
            expect(res.status).toBe(200);

            reqBody = {
                name: 'RoeiGroup3',
                types: ['distribution'],
                applicant: '507f1f77bcf86cd799438011',
            }

            res = await request(server.app).post(`/api/requests/createGroup`).send(reqBody);
            expect(res.status).toBe(200);

            await request(server.app).post(`/api/executedRequest/1`).send({}).expect(200);
            await request(server.app).post(`/api/executedRequest/2`).send({}).expect(200);
            await request(server.app).post(`/api/executedRequest/3`).send({}).expect(200);

            const dbs = await findByQuery(groupsCollection, {});
            console.log(dbs);

        })

        it('Get By Group Id', async () => {

            const groupInDB = await findOneByQuery(groupsCollection, {
                name: 'RoeiGroup'
            });

            let res = await request(server.app).get(`/api/groups/${groupInDB._id.toString()}`).expect(200);
            expect(res.body).toBeTruthy()

            await request(server.app).get(`/api/groups/507f1f77bcf86cd799438011`).expect(404);

            await request(server.app).get(`/api/groups/1234`).expect(400);
        })

        it('Get By Group name', async () => {
            let res = await request(server.app).get(`/api/groups/name/RoeiGroup`).expect(200);
            expect(res.body).toBeTruthy()

            res = await request(server.app).get(`/api/groups/name/RoeiGroup2`).expect(200);
            expect(res.body).toBeTruthy()

            res = await request(server.app).get(`/api/groups/name/RoeiGroup3`).expect(200);
            expect(res.body).toBeTruthy()

            res = await request(server.app).get(`/api/groups/name/RoeiGroup4`).expect(404);
        })

        it('Get By Admin Id', async () => {
            let res = await request(server.app).get(`/api/groups/admin/507f1f77bcf86cd799439011`).expect(200);
            expect(res.body.length).toBe(2)

            res = await request(server.app).get(`/api/groups/admin/507f1f77bcf86cd799438011`).expect(200);
            expect(res.body.length).toBe(1)

            res = await request(server.app).get(`/api/groups/admin/507f1f77ccf86cd799438011`).expect(200);
            expect(res.body.length).toBe(0)

            await request(server.app).get(`/api/groups/admin/123465`).expect(400);
        })

    })
}