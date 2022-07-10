import { Request, Response, NextFunction } from 'express';

export type middlewareType = { async(req: Request, res: Response, next: NextFunction): Promise<void> };
