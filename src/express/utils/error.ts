import * as express from 'express';
import { logError } from '../../log/logger';
import BaseError from './BaseError';
import ResponseHandler from './responseHandler';

/* eslint-disable max-classes-per-file */

export class ServiceError extends BaseError {
    public code: number;

    constructor(code: number, message: string) {
        super(message);
        this.code = code;
    }
}

export class InternalError extends ServiceError {
    constructor(message = 'Internal error') {
        super(500, message);
    }
}

export class forbiddenError extends ServiceError {
    constructor(message = 'Permission denied') {
        super(401, message);
    }
}

export class BadRequestError extends ServiceError {
    constructor(message = 'Bad Request') {
        super(400, message);
    }
}

export class NotFoundError extends ServiceError {
    constructor(message = 'Not found') {
        super(404, message);
    }
}

/**
 * Error middleware, handles the error by the status code.
 * @param { Error } error - The error
 * @param { express.Request } _req - The request object.
 * @param { express.Response } res - The result object
 * @param { express.NextFunction } _next - The next function
 */
export const errorMiddleware = (error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (error instanceof BadRequestError) {
        ResponseHandler.clientError(res, error.message);
    } else if (error instanceof NotFoundError) {
        ResponseHandler.notFound(res, error.message);
    } else {
        ResponseHandler.internal(res, error.message);
    }
    logError(JSON.stringify(error));
};
