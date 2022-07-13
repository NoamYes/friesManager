import { IRequestService } from '../../interfaces/requestService.interface';
import { IRequestController } from './../../interfaces/requestController.interface';
import { Request, Response } from 'express';
export default class implements IRequestController {
    private _service: IRequestService;

    constructor(RequestService: IRequestService) {
        this._service = RequestService;
    }

    public createCreateGroup = async (req: Request, res: Response): Promise<void> => {
        const { name, applicant, types, approvalsNeeded } = req.body;
        const id: string = await this._service.createCreateGroup({ name, applicant, types, approvalsNeeded });
        res.send({ id });
    };

    public approveRound = async (req: Request, res: Response): Promise<void> => {
        const { requestId } = req.params;
        const { authorityId, approved } = req.body;

        const result: boolean = await this._service.approveRound(requestId, authorityId, approved);

        res.send(result);
    }

    // public addDisToGroup = async (req: Request, res: Response): Promise<void> => {
    //     const { name, applicant, types } = req.body;
    //     const user: User | null = await this._service.addDisToGroup({ name, applicant, types });

    //     if (!user) res.status(404).send({ message: 'fail to create user' });

    //     res.send(user);
    // };
}
