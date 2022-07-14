import { createGroupDTO, disToGroupDTO } from '../express/joi/validator/request.schema';

export interface IRequestService {
    createCreateGroup(requestDetails: createGroupDTO): Promise<string>;
    addDisToGroup(requestDetails: disToGroupDTO): Promise<string>;

    approveRound(requestId: string, authorityId: string, approved: boolean): Promise<boolean>;
}
