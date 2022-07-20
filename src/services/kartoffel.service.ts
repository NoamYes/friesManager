import { NextFunction, Request, Response } from 'express';
import config from '../config';
import IKartoffelService from '../interfaces/kartoffelService.interface';
import axios, { AxiosInstance } from 'axios';

class KartoffelService implements IKartoffelService {
    _kartoffelAxios: AxiosInstance;

    constructor(baseUrl: string) {
        this._kartoffelAxios = axios.create({ baseURL: baseUrl }); // TODO: add wrap token and http agent
    }

    public getEntityDis = async (entityId: string): Promise<string[]> => {
        try {
            // const token: string = req.header('Authorization') as string;
            // const userId = await this.checkAuth(token);
            const entity = (await this._kartoffelAxios.get(`/entities/${entityId}`)).data;
            return entity.digitalIdentities.map((di: { uniqueId: string }) => di.uniqueId);
        } catch (error) {
            return []; // TODO: think about return some kind of error to handle next
        }
    };
}

export default KartoffelService;
