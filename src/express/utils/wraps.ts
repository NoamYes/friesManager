import { Response, Request, NextFunction } from 'express';

export const wrapValidator = (func: (req: Request, res?: Response) => Promise<void>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        func(req, res)
            .then(() => next())
            .catch(next);
    };
};

/**
 * Wrap function for catching errors
 * @param func - The function that being called
 */
export const wrapController = (func: (req: Request, res: Response, next?: NextFunction) => Promise<void>, extraFields?: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        res.locals = { ...extraFields };
        func(req, res).catch(next);
    };
};
