import { NextFunction, Request, Response } from 'express';
import config from '../../config/config';
import IAuth from '../../interfaces/auth.interface';

class Auth implements IAuth {
    public checkAuth: (token: string) => Promise<string | null>;

    constructor(auth: (token: string) => Promise<string | null>) {
        this.checkAuth = auth;
    }

    public check = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        if (!config.server.needAuth) return next();

        try {
            const token: string = req.header('Authorization') as string;
            const userId = await this.checkAuth(token);
            if (!userId) {
                res.status(401).send({ error: 'unauthorized', status: 401 });
            } else {
                req['userId'] = userId;
                next();
            }
        } catch (error) {
            res.status(401).send({ error: 'unauthorized', status: 401 });
        }
    };
}

export default Auth;
