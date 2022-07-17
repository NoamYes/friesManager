import { Request, Response } from "express";

export interface IExecutedRequestsController {
    executedRequest(req: Request, res: Response): Promise<void>;
}
