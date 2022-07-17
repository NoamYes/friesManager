import { IRequestService } from '../../interfaces/requestService.interface';
import { IRequestController } from './../../interfaces/requestController.interface';
import { Request, Response } from 'express';
import { REQUEST_TYPE } from '../../config/enums';
export default class implements IRequestController {
    private _service: IRequestService;

    private _serviceMap;

    constructor(RequestService: IRequestService) {
        this._service = RequestService;
        this._serviceMap = {
            [REQUEST_TYPE.CREATE_GROUP]: this._service.createGroup,
            [REQUEST_TYPE.ADD_DIS_GROUP]: this._service.addDisToGroup,
            [REQUEST_TYPE.REMOVE_DIS_GROUP]: this._service.removeDisFromGroup
        }
    }

    public createRequest = async (req: Request, res: Response): Promise<void> => {
        const requestType = res.locals.type;

        const id: string = await this._serviceMap[requestType]({ ...req.body });

        res.send({ id });
    }

    public approveRound = async (req: Request, res: Response): Promise<void> => {
        const { requestId } = req.params;
        const { authorityId, approved } = req.body;

        const result: boolean = await this._service.approveRound(requestId, authorityId, approved);

        res.send(result);
    }
}
