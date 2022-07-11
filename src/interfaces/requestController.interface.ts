import { Response, Request } from 'express';

export interface IRequestController {
    createGroup(req: Request, res: Response): Promise<void>;
    addDisToGroup(req: Request, res: Response): Promise<void>;
}
