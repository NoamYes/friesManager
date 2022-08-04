import { REQUEST_TYPE } from '../config/enums';
import { IGroupService } from '../interfaces/groupService.interface';
import { IExecutedRequestsUseCases } from '../interfaces/IExecutedRequestService.interface';
import { IRequestRepo } from '../interfaces/requestRepo.interface';
import { BadRequestError } from '../express/utils/error';
import { Request } from '../domain/request';

export default class implements IExecutedRequestsUseCases {
    private _requestRepo: IRequestRepo;
    private _groupService: IGroupService;
    private _groupServicesMap;

    constructor(requestsRepo: IRequestRepo, groupService: IGroupService) {
        this._requestRepo = requestsRepo;
        this._groupService = groupService;

        this._groupServicesMap = {
            [REQUEST_TYPE.CREATE]: this._groupService.createGroup,
            [REQUEST_TYPE.ADD_DIS]: this._groupService.addDisToGroup,
            [REQUEST_TYPE.REMOVE_DIS]: this._groupService.removeDisFromGroup,
            [REQUEST_TYPE.ADD_ENTITIES]: this._groupService.addEntities,
            [REQUEST_TYPE.REMOVE_ENTITIES]: this._groupService.removeEntities,
            [REQUEST_TYPE.RENAME]: this._groupService.rename,
            [REQUEST_TYPE.ADD_ADMINS]: this._groupService.addAdmins,
            [REQUEST_TYPE.REMOVE_ADMINS]: this._groupService.removeAdmins,

        };
    }

    public executedRequest = async (requestNumber: number): Promise<boolean> => {
        const request: Request | null = await this._requestRepo.findByRequestNumber(requestNumber);

        if (!request) throw new BadRequestError('Group with request number not found');

        const res = await this._groupServicesMap[request.type](request.payload);

        return !!res;
    };
}
