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

export const testEntitiesToGroup = () => {
    let kartoffelEntities: any = [];
    let addEntitiesIds: string[] = [];
    let removeEntitiesIds: string[] = [];

    describe('Add and Remove entities from group useCases', () => {

        beforeAll(async () => {
            await emptyDB();
            try {
                kartoffelEntities = (await axios.get(`${config.kartoffel.baseURL}/entities?page=1&pageSize=2&expanded=true`)).data;
                addEntitiesIds = [kartoffelEntities[0].id, kartoffelEntities[1].id];
                removeEntitiesIds = [kartoffelEntities[1].id];

            } catch (err) {
                console.log(err)
            }
        })

        let reqCreateBody = {
            name: 'RoeiGroup',
            types: ['distribution'],
            applicant: '507f1f77bcf86cd799439011',
        };

        let groupId: string;

        it('Valid add entities to group request without approval', async () => {
            let res = await request(server.app).post(`/api/requests/create`).send(reqCreateBody).expect(200);

            await request(server.app).post(`/api/executedRequest/${res.body.requestNumber}`).send({}).expect(200);

            let foundCreatedGroup = await findOneByQuery(groupsCollectionName, {
                name: reqCreateBody.name,
            });

            groupId = foundCreatedGroup._id.toString();

            let reqAddBody = {
                groupId,
                entitiesId: addEntitiesIds,
                applicant: '507f1f77bcf86cd799439011',
            };

            res = await request(server.app).post(`/api/requests/addEntities`).send(reqAddBody).expect(200);

            let insertedAddEntitiesRequest = await findOneByQuery(requestsCollectionName, {
                requestNumber: res.body.requestNumber
            });

            expect(insertedAddEntitiesRequest).toBeTruthy();
            expect(arraysAreIdentical(addEntitiesIds, insertedAddEntitiesRequest.entitiesId)).toBeTruthy();

            await request(server.app).post(`/api/executedRequest/${res.body.requestNumber}`).send({}).expect(200);

            foundCreatedGroup = await findOneByQuery(groupsCollectionName, {
                name: reqCreateBody.name,
            });

            const expectedGroupEntitiesArray = kartoffelEntities.map(entity => {
                return {
                    id: entity.id,
                    dis: entity.digitalIdentities.map(di => di.uniqueId)
                }
            })

            const foundGroupEntities = foundCreatedGroup.entities;

            expect(foundGroupEntities.length).toBe(expectedGroupEntitiesArray.length);

            for (let i = 0; i < foundGroupEntities; i++) {
                expect(foundGroupEntities[i].id).toBe(expectedGroupEntitiesArray[i].id);
                expect(arraysAreIdentical(foundGroupEntities[i].dis, expectedGroupEntitiesArray[i].dis)).toBeTruthy();
            }

            // expect(arraysAreIdentical(foundCreatedGroup.entities, expectedGroupEntitiesArray)).toBeTruthy();

        })

        it('Valid remove entities from group request without approval', async () => {

            const reqBody = {
                groupId,
                entitiesId: removeEntitiesIds,
                applicant: '507f1f77bcf86cd799439011',
            }

            const res = await request(server.app).post(`/api/requests/removeEntities`).send(reqBody).expect(200);
            const requestNumber = res.body.requestNumber;
            expect(requestNumber).toBeTruthy();

            let insertedRemoveEntitiesRequest = await findOneByQuery(requestsCollectionName, {
                requestNumber
            });

            expect(insertedRemoveEntitiesRequest).toBeTruthy();
            expect(arraysAreIdentical(insertedRemoveEntitiesRequest.entitiesId, removeEntitiesIds)).toBeTruthy();

            await request(server.app).post(`/api/executedRequest/${requestNumber}`).send({}).expect(200);

            const group = await findOneByQuery(groupsCollectionName, {
                name: reqCreateBody.name
            });

            const expectedGroupEntitiesArray = kartoffelEntities.map((entity: { id: any; digitalIdentities: any[]; }) => {
                return {
                    id: entity.id,
                    dis: entity.digitalIdentities.map(di => di.uniqueId)
                }
            }).filter((entity: { id: string; }) => !removeEntitiesIds.includes(entity.id));

            expect(group.entities.length).toBe(expectedGroupEntitiesArray.length);

            for (let i = 0; i < group.entities; i++) {
                expect(group.entities[i].id).toBe(expectedGroupEntitiesArray[i].id);
                expect(arraysAreIdentical(group.entities[i].dis, expectedGroupEntitiesArray[i].dis)).toBeTruthy();
            }

        })

    })
}