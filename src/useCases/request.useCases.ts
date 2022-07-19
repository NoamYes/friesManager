import { InternalError, BadRequestError, NotFoundError } from '../express/utils/error';
import { IRequestRepo } from '../interfaces/requestRepo.interface';
import { approveRoundDTO, createGroupDTO, disToGroupDTO as addDisToGroupDTO } from '../express/joi/validator/request.schema';
import { IRequestUseCases } from '../interfaces/requestService.interface';
import { REQUEST_TYPE } from '../config/enums';
import { Request } from '../domain/request';

export default class implements IRequestUseCases {
    private repo: IRequestRepo;

    constructor(requestRepo: IRequestRepo) {
        this.repo = requestRepo;
    }

    //TODO: return request number instead of request id
    public createGroup = async (requestDetails: createGroupDTO): Promise<string> => {
        const existsRequest = await this.repo.findOne({ name: requestDetails.name }, REQUEST_TYPE.CREATE_GROUP);

        if (existsRequest) throw new BadRequestError(`Create request of a group with the name ${requestDetails.name} already exists`);

        const { applicant, approvalsNeeded } = requestDetails;
        const requestProps = { type: REQUEST_TYPE.CREATE_GROUP, applicant, approvalsNeeded };
        const payload = {
            name: requestDetails.name,
            types: requestDetails.types,
            admin: applicant,
            ...(requestDetails.clearance ? { clearance: requestDetails.clearance } : {}),
        }; //TODO: think about applicant

        const requestNumber = (await this.repo.count()) + 1;

        const newRequest: Request = Request.createNew({ ...requestProps, payload, requestNumber });

        const res = await this.repo.create(newRequest, REQUEST_TYPE.CREATE_GROUP);

        if (!res) throw new InternalError(`Error Creating Create Group Request: ${payload.name}`);

        return newRequest.id!.toString();
    };

    public addDisToGroup = async (requestDetails: addDisToGroupDTO): Promise<string> => {
        // TODO: check if request already exists ?
        // TODO: Check that the groupId is exists in the groups collection !!!

        const { applicant, approvalsNeeded } = requestDetails;
        const requestProps = { type: REQUEST_TYPE.ADD_DIS_GROUP, applicant, approvalsNeeded };
        const payload = { groupId: requestDetails.groupId, disUniqueId: requestDetails.disUniqueId };

        const requestNumber = (await this.repo.count()) + 1;

        const newRequest: Request = Request.createNew({ ...requestProps, payload, requestNumber });

        const res = await this.repo.create(newRequest, REQUEST_TYPE.ADD_DIS_GROUP);

        if (!res) throw new InternalError(`Error Creating Add Dis To Group Request: ${payload.groupId} -> ${payload.disUniqueId}`);

        return newRequest.id!.toString();
    };

    public removeDisFromGroup = async (requestDetails: addDisToGroupDTO): Promise<string> => {
        const { applicant, approvalsNeeded } = requestDetails;
        const requestProps = { type: REQUEST_TYPE.REMOVE_DIS_GROUP, applicant, approvalsNeeded };
        const payload = { groupId: requestDetails.groupId, disUniqueId: requestDetails.disUniqueId };

        const requestNumber = (await this.repo.count()) + 1;

        const newRequest: Request = Request.createNew({ ...requestProps, payload, requestNumber });

        const res = await this.repo.create(newRequest, REQUEST_TYPE.REMOVE_DIS_GROUP);

        if (!res) throw new InternalError(`Error Creating Add Dis To Group Request: ${payload.groupId} -> ${payload.disUniqueId}`);

        return newRequest.id!.toString();
    };

    public approveRound = async (approveDetails: approveRoundDTO): Promise<boolean> => {
        const { requestId, authorityId, approved } = approveDetails;
        const request: Request | null = await this.repo.findById(requestId);

        if (!request) throw new NotFoundError(`Request Not Found`);

        request.approveRound(authorityId, approved);
        request.checkAllApprovalRounds();

        const res = await this.repo.save(requestId, request, request.type);

        return !!res;
    };

    // public auth = async (token: string) => {
    //     const payload: any = verify(token, config.keys.tokenKey);

    //     if (!payload || !payload.userIdEnc) return null;

    //     const userId = decrypt(payload.userIdEnc);

    //     const user = await this.getUserById(userId);

    //     if (!user) return null;

    //     return userId;
    // };
}
