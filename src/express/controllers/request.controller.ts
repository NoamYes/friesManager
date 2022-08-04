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
            [REQUEST_TYPE.CREATE]: this._useCases.create,
            [REQUEST_TYPE.ADD_DIS]: this._useCases.addDis,
            [REQUEST_TYPE.REMOVE_DIS]: this._useCases.removeDis,
            [REQUEST_TYPE.ADD_ENTITIES]: this._useCases.addEntities,
            [REQUEST_TYPE.REMOVE_ENTITIES]: this._useCases.removeEntities,
            [REQUEST_TYPE.RENAME]: this._useCases.rename,
            [REQUEST_TYPE.ADD_ADMINS]: this._useCases.addAdmins,
            [REQUEST_TYPE.REMOVE_ADMINS]: this._useCases.removeAdmins,
            [REQUEST_TYPE.CHANGE_CLEARANCE]: this._useCases.changeClearance,
            [REQUEST_TYPE.DELETE]: this._useCases.deleteGroup
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
