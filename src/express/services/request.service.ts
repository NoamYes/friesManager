import { InternalError, BadRequestError, NotFoundError } from './../utils/error';
import { IRequestRepo } from './../../interfaces/requestRepo.interface';
import { createGroupDTO } from './../joi/validator/request.schema';
import { IRequestService } from '../../interfaces/requestService.interface';
import { REQUEST_TYPE } from '../../config/enums';
import { Request } from '../../domain/request';

export default class implements IRequestService {
    private repo: IRequestRepo;

    constructor(requestRepo: IRequestRepo) {
        this.repo = requestRepo;
    }

    public createCreateGroup = async (requestDetails: createGroupDTO): Promise<string> => {
        const existsRequest = await this.repo.findOne({ name: requestDetails.name }, REQUEST_TYPE.CREATE_GROUP);

        if (existsRequest) throw new BadRequestError(`Create request of a group with the name ${requestDetails.name} already exists`);

        const { applicant, approvalsNeeded } = requestDetails;

        const requestProps = { type: REQUEST_TYPE.CREATE_GROUP, applicant, approvalsNeeded };

        const payload = { name: requestDetails.name, types: requestDetails.types };

        const newRequest: Request = Request._createNew({ ...requestProps, payload });

        const res = await this.repo.create(newRequest, REQUEST_TYPE.CREATE_GROUP);

        if (!res) throw new InternalError(`Error creating group: ${payload.name}`);

        return newRequest.id!.toString();
    };

    public approveRound = async (requestId: string, authorityId: string, approved: boolean): Promise<boolean> => {
        const request: Request | null = await this.repo.findById(requestId);

        if (!request) throw new NotFoundError(`Request Not Found`);

        request.approveRound(authorityId, approved);
        request.checkAllApprovalRounds();

        const res = await this.repo.save(requestId, request, request.type);

        return !!res;

    }

    // public updateCreateGroup = async (group: createGroupDTO): Promise<boolean> => {
    //     const existsRequest = await this.repo.find({ name: group.name }, REQUEST_TYPE.CREATE_GROUP);

    //     if (!existsRequest) throw new NotFoundError();

    //     const newRequest: CreateGroupRequest = Request._create(group);

    //     newRequest.approvalsNeeded = ();

    //     const res = await this.repo.save(newRequest.toP, REQUEST_TYPE.CREATE_GROUP);
    //     return res;
    // };

    // public auth = async (token: string) => {
    //     const payload: any = verify(token, config.keys.tokenKey);

    //     if (!payload || !payload.userIdEnc) return null;

    //     const userId = decrypt(payload.userIdEnc);

    //     const user = await this.getUserById(userId);

    //     if (!user) return null;

    //     return userId;
    // };
}
