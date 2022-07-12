// import { RequestModel } from './../models/request.model';
import { requestQuery } from './../../interfaces/requestRepo.interface';
import { REQUEST_TYPE } from '../../config/enums';
import { IRequestRepo } from '../../interfaces/requestRepo.interface';
import mongoose from 'mongoose';
import { MongoError } from '../../express/utils/error';
import { Request } from '../../domain/request';

export default class implements IRequestRepo {
    private _modelsMap: { [key: string]: typeof mongoose.Model };

    constructor(modelsMap: { [key: string]: typeof mongoose.Model }) {
        this._modelsMap = modelsMap;
    }

    public create = async (req: Request, requestType: REQUEST_TYPE): Promise<boolean> => {
        try {
            const doc = Request.toPersistance(req);
            const res = await this._modelsMap[requestType].create(doc);
            return !!res;
        } catch (err: any) {
            console.log(err.message);
            throw new MongoError(err.message);
        }
    };

    public save = async (req: Request, requestType: REQUEST_TYPE, query: requestQuery): Promise<boolean> => {
        try {
            const doc = Request.toPersistance(req);
            const res = await this._modelsMap[requestType].updateOne(query, { $set: doc });
            return !!res;
        } catch (err: any) {
            console.log(err.message);
            throw new MongoError(err.message);
        }
    };

    public find = async (query: requestQuery, requestType: REQUEST_TYPE = REQUEST_TYPE.BASE_REQ): Promise<any> => {
        // TODO: again, specify doc type
        const res = await this._modelsMap[requestType].findOne(query);
        return res;
    };
}
