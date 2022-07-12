/* eslint-disable no-empty */
/* eslint-disable import/prefer-default-export */
import * as mongoose from 'mongoose';
import config from '../../src/config';

export const emptyDB = async () => {
    const requestsCollection = mongoose.models[config.mongo.requestCollectionName];
    try {
        await requestsCollection.deleteMany({});
    } catch (err) { }
};

// export const seedDB = async () => {
//     const migrationEntities = JSON.parse(fs.readFileSync(`${process.cwd()}/mocks/migrationEntities.json`, 'utf-8'));

//     try {
//         await migrationEntitiesCollection.insertMany(migrationEntities);
//         // await permissionsCollection.insertMany(permissions);
//         // await preMigrationCollection.insertMany(perMigrations);
//     } catch (err) { }
// };

export const findByQuery = async (collectionName: string, query: Object) => {

    const collection = mongoose.connection.db.collection(collectionName);
    const res = (await collection.find(query)).toArray();
    return res;
};

export const findOneByQuery = async (collectionName: string, query: Object): Promise<any> => {
    const collection = mongoose.connection.db.collection(collectionName);
    try {
        let res = await collection.findOne(query);
        return res;
    } catch (err) {
        console.log(err);
    }
    return null;
};
