import { IRequestService } from '../../interfaces/requestService.interface';
import { IRequestController } from './../../interfaces/requestController.interface';
import { IUserService } from '../../interfaces/userService.interface';
import { Request, Response } from 'express';
import { LoginUser } from '../../types/loginUser.type';
import { logInfo } from '../../log/logger';
export class RequestController implements IRequestController {
    private _service: IRequestService;

    constructor(RequestService: IRequestService) {
        logInfo('UserController created');
        this._service = RequestService;
    }

    public createGroup = async (req: Request, res: Response): Promise<void> => {
        const { name, applicant, types } = req.body;
        const result: boolean = await this._service.createGroup({ name, applicant, types });

        if (!result) res.status(404).send({ message: 'fail to login' });
        else res.send(result);
    };

    public addDisToGroup = async (req: Request, res: Response): Promise<void> => {
        const { name, applicant, types } = req.body;
        const user: User | null = await this._service.addDisToGroup(req.body);

        if (!user) res.status(404).send({ message: 'fail to create user' });

        res.send(user);
    };
}
