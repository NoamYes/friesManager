import { IRequestUseCases } from '../../interfaces/requestService.interface';
import { IRequestController } from './../../interfaces/requestController.interface';
import { Request, Response } from 'express';
import { REQUEST_TYPE } from '../../config/enums';
export default class implements IRequestController {
    private _useCases: IRequestUseCases;

    private _useCasesMap;

    constructor(RequestUseCases: IRequestUseCases) {
        this._useCases = RequestUseCases;
        this._useCasesMap = {
            [REQUEST_TYPE.CREATE_GROUP]: this._useCases.createGroup,
            [REQUEST_TYPE.ADD_DIS_GROUP]: this._useCases.addDisToGroup,
            [REQUEST_TYPE.REMOVE_DIS_GROUP]: this._useCases.removeDisFromGroup,
        };
    }

    public createRequest = async (req: Request, res: Response): Promise<void> => {
        const requestType = res.locals.type;

        const requestNumber: number = await this._useCasesMap[requestType]({ ...req.body });

        res.send({ requestNumber });
    };

    public approveRound = async (req: Request, res: Response): Promise<void> => {
        const { requestNumber } = req.params;
        const { authorityId, approved } = req.body;

        const result: boolean = await this._useCases.approveRound({ requestNumber: +requestNumber, authorityId, approved });

        res.send(result);
    };
}
