import config from '../config';
import IKartoffelService from '../interfaces/kartoffelService.interface';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import getToken from '../auth/spike';
import * as https from 'https';

class TokenWrap {
    token?: string;

    async getToken(renewToken: Boolean): Promise<string> {
        if (renewToken || !this.token) {
            this.token = await getToken();
            return this.token;
        }

        return this.token;
    }
}


class KartoffelService implements IKartoffelService {
    private _kartoffelAxios: AxiosInstance;
    private _tokenWrap: TokenWrap;

    constructor(baseUrl: string) {
        this._kartoffelAxios = axios.create({
            baseURL: baseUrl,
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        });
        this._tokenWrap = new TokenWrap();
        this.setUpAxiosInterceptors();
    }

    private setUpAxiosInterceptors = async (): Promise<void> => {
        this._kartoffelAxios.interceptors.request.use(async (reqConfig: AxiosRequestConfig) => {
            try {
                if (config.kartoffel.isAuth) reqConfig.headers!.Authorization = await this._tokenWrap.getToken(false);
                return reqConfig;
            } catch (err) {
                console.log(err)
                return reqConfig;
            }
        });

        this._kartoffelAxios.interceptors.response.use(
            (response: AxiosResponse) => response,
            async (error: AxiosError) => {
                if (error.status === '401') {
                    const { config } = error;
                    config.headers!.Authorization = await this._tokenWrap.getToken(true);
                    return axios.request(config);
                }

                return Promise.reject(error);
            },
        );

    }

    public getEntityDis = async (entityId: string): Promise<string[]> => {
        try {
            const entity = (await this._kartoffelAxios.get(`/entities/${entityId}?expanded=true`)).data;
            return entity.digitalIdentities.map((di: { uniqueId: string }) => di.uniqueId);
        } catch (error) {
            return []; // TODO: think about return some kind of error to handle next
        }
    };
}

export default KartoffelService;
