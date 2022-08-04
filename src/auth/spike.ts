import * as getTokenCreator from 'spike-token-manager';
import * as path from 'path';
import config from '../config';

const { spike, redisUrl } = config;

const options = {
    redisHost: redisUrl,
    clientId: spike.clientId,
    clientSecret: spike.clientSecret,
    spikeURL: spike.spikeUrl,
    tokenGrantType: 'client_credentials',
    tokenAudience: spike.kartoffelAud,
    tokenRedisKeyName: spike.redisKeyName,
    spikePublicKeyFullPath: path.join(process.cwd(), '/key/key.pem'),
    useRedis: !process.env.LOAD_DEV_DOTENV,
    httpsValidation: false,
};

export const token = () => getTokenCreator(options)();

const getToken = async () => await token();

export default getToken;
