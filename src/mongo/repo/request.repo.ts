import { RequestModel } from './../models/request.model';
import { requestQuery } from './../../interfaces/requestRepo.interface';
import { REQUEST_TYPE } from '../../config/enums';
import { IRequestRepo } from '../../interfaces/requestRepo.interface';

export class RequestRepo implements IRequestRepo {
    private _modelsMap: { [key: string]: typeof RequestModel };

    constructor(modelsMap: { [key: string]: typeof RequestModel }) {
        this._modelsMap = modelsMap;
    }

    public create = async (doc: any, requestType: REQUEST_TYPE): Promise<boolean> => {
        const res = await this._modelsMap[requestType].create(doc);
        return !!res;
    };

    public save = async (doc: any, requestType: REQUEST_TYPE, query: requestQuery = {}): Promise<boolean> => {
        const res = await this._modelsMap[requestType].updateOne(query, { $set: doc });
        return !!res;
    };

    public find = async (query: requestQuery, requestType: REQUEST_TYPE = REQUEST_TYPE.BASE_REQ): Promise<any> => {
        // TODO: again, specify doc type
        const res = await this._modelsMap[requestType].findOne(query);
        return res;
    };
}
