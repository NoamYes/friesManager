import { RequestHandler } from 'express';

interface IAuth {
    check: RequestHandler;
}

export default IAuth;
