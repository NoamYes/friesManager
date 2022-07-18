import { requestQuery } from './../../interfaces/requestRepo.interface';
import { REQUEST_TYPE } from '../../config/enums';
import { IRequestRepo } from '../../interfaces/requestRepo.interface';
import mongoose, { Types } from 'mongoose';
import { MongoError } from '../../express/utils/error';
import { Request } from '../../domain/request';
import { RequestDoc } from '../models/request.model';

export default class implements IRequestRepo {
    private _modelsMap: { [key: string]: typeof mongoose.Model };

    constructor(modelsMap: { [key: string]: typeof mongoose.Model }) {
        this._modelsMap = modelsMap;
    }

    public create = async (request: Request, requestType: REQUEST_TYPE): Promise<boolean> => {
        try {
            const doc: RequestDoc = Request.toPersistance(request);
            const res = await this._modelsMap[requestType].create(doc);
            return !!res;
        } catch (err: any) {
            console.log(err.message);
            throw new MongoError(err.message);
        }
    };

    public save = async (id: string, request: Request, requestType: REQUEST_TYPE): Promise<boolean> => {
        try {
            const doc: RequestDoc = Request.toPersistance(request);
            const res = await this._modelsMap[requestType].updateOne({ _id: new Types.ObjectId(id) }, { $set: doc });
            return !!res;
        } catch (err: any) {
            console.log(err.message);
            throw new MongoError(err.message);
        }
    };

    public findById = async (id: string): Promise<Request | null> => {
        const res = await this._modelsMap[REQUEST_TYPE.BASE_REQ].findOne({ _id: new Types.ObjectId(id) }).lean();

        if (!res) return null;

        return Request.toDomain(res);
    };

    public findOne = async (query: requestQuery, requestType: REQUEST_TYPE = REQUEST_TYPE.BASE_REQ): Promise<Request | null> => {
        const res = await this._modelsMap[requestType].findOne(query).lean();

        if (!res) return null;

        return Request.toDomain(res);
    };

    public count = async (): Promise<number> => {
        return await this._modelsMap[REQUEST_TYPE.BASE_REQ].count({});
    };

    public findByRequestNumber = async (requestNumber: number): Promise<Request | null> => {
        const foundRequest = await this._modelsMap[REQUEST_TYPE.BASE_REQ].findOne({ requestNumber }).lean();
        return Request.toDomain(foundRequest);
    };
}
