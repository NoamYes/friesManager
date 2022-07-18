import { Request, Response } from "express";

export interface IGroupController {
    getById(req: Request, res: Response): Promise<void>;
    getByName(req: Request, res: Response): Promise<void>;
    getByAdminId(req: Request, res: Response): Promise<void>;
}