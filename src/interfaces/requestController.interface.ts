import { Response, Request } from 'express';

export interface IRequestController {
    createCreateGroup(req: Request, res: Response): Promise<void>;
    approveRound(req: Request, res: Response): Promise<void>
    // addDisToGroup(req: Request, res: Response): Promise<void>;
}
