import { Request, Response, NextFunction } from 'express-serve-static-core';
import IAuth from './../../src/interfaces/auth.interface';

class AuthMock implements IAuth {
    public checkAuth: (token: string) => Promise<string | null>;

    constructor(checkAuth: (token: string) => Promise<string | null>) {
        this.checkAuth = checkAuth;
    }

    public check = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const token: string = req.header('Authorization') as string;
            const userId = this.checkAuth(token);
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

export default AuthMock;
