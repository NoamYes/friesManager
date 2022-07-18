import { Request, Response } from 'express';
import { IExecutedRequestsController } from '../../interfaces/executedRequestController.interface';
import { IExecutedRequestsUseCases } from '../../interfaces/IExecutedRequestService.interface';

export default class implements IExecutedRequestsController {
    private _useCases: IExecutedRequestsUseCases;

    constructor(service: IExecutedRequestsUseCases) {
        this._useCases = service;
    }

    public executedRequest = async (req: Request, res: Response): Promise<void> => {
        const { requestNumber } = req.params;
        const result = await this._useCases.executedRequest(+requestNumber);
        res.send(result);
    };
}
