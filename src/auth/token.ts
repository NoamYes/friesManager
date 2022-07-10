import { sign } from 'jsonwebtoken';
import config from '../config/config';
import { encrypt } from '../utils/encrypt';

export const generateToken = (userId: string) => {
    const payload = {
        userIdEnc: encrypt(userId),
    };

    return sign(payload, config.keys.tokenKey, { expiresIn: '24h' });
};
