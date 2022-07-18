import { approveRoundDTO, createGroupDTO, disToGroupDTO } from '../express/joi/validator/request.schema';

export interface IRequestService {
    createGroup(requestDetails: createGroupDTO): Promise<string>;
    addDisToGroup(requestDetails: disToGroupDTO): Promise<string>;
    removeDisFromGroup(requestDetails: disToGroupDTO): Promise<string>;

    approveRound(approveDetails: approveRoundDTO): Promise<boolean>;
}
