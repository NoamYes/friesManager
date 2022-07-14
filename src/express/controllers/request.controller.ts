import { validateRequestBySchema } from './../joi/joi';
import { IRequestService } from '../../interfaces/requestService.interface';
import { IRequestController } from './../../interfaces/requestController.interface';
import { Request, Response } from 'express';
import { schemasMap } from '../joi/validator/request.schema';
import { REQUEST_TYPE } from '../../config/enums';
import { BadRequestError } from '../utils/error';
export default class implements IRequestController {
    private _service: IRequestService;

    private _serviceMap;

    constructor(RequestService: IRequestService) {
        this._service = RequestService;
        this._serviceMap = {
            [REQUEST_TYPE.CREATE_GROUP]: this._service.createCreateGroup,
            [REQUEST_TYPE.ADD_DIS_GROUP]: this._service.addDisToGroup,
        }
    }

    // public createCreateGroup = async (req: Request, res: Response): Promise<void> => {
    //     const { name, applicant, types, approvalsNeeded } = req.body;
    //     const id: string = await this._service.createCreateGroup({ name, applicant, types, approvalsNeeded });
    //     res.send({ id });
    // };

    // public addDisToGroup = async (req: Request, res: Response): Promise<void> => {
    //     const { groupId, disUniqueId, applicant, approvalsNeeded } = req.body;
    //     const id: string = await this._service.addDisToGroup({ groupId, disUniqueId, applicant, approvalsNeeded });
    //     res.send({ id });
    // }

    public createRequest = async (req: Request, res: Response): Promise<void> => {
        const requestType = req.body.type;

        if (!Object.values(REQUEST_TYPE).includes(requestType))
            throw new BadRequestError('Invalid request type');

        const schema = schemasMap[requestType];
        validateRequestBySchema(schema, req);

        delete req.body.type;

        const id: string = await this._serviceMap[requestType]({ ...req.body });

        res.send({ id });
    }

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
