import { Request, Response } from 'express';
import { IExecutedRequestsController } from '../../interfaces/executedRequestController.interface';
import { IExecutedRequestsService } from '../../interfaces/IExecutedRequestService.interface';

export default class implements IExecutedRequestsController {
    private _service: IExecutedRequestsService;

    constructor(service: IExecutedRequestsService) {
        this._service = service;
    }

    public executedRequest = async (req: Request, res: Response): Promise<void> => {
        const { requestNumber } = req.params;
        const result = await this._service.executedRequest(+requestNumber);
        res.send(result);
    };
}
