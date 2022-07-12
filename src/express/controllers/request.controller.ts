import { IRequestService } from '../../interfaces/requestService.interface';
import { IRequestController } from './../../interfaces/requestController.interface';
import { Request, Response } from 'express';
import { logInfo } from '../../log/logger';
export default class implements IRequestController {
    private _service: IRequestService;

    constructor(RequestService: IRequestService) {
        logInfo('UserController created');
        this._service = RequestService;
    }

    public createCreateGroup = async (req: Request, res: Response): Promise<void> => {
        const { name, applicant, types, approvalsNeeded } = req.body;
        const result: boolean = await this._service.createCreateGroup({ name, applicant, types, approvalsNeeded });
        res.send(result);
    };

    // public addDisToGroup = async (req: Request, res: Response): Promise<void> => {
    //     const { name, applicant, types } = req.body;
    //     const user: User | null = await this._service.addDisToGroup({ name, applicant, types });

    //     if (!user) res.status(404).send({ message: 'fail to create user' });

    //     res.send(user);
    // };
}
