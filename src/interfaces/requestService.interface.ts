import { approveRoundDTO, createGroupDTO, disToGroupDTO } from '../express/joi/validator/request.schema';

export interface IRequestUseCases {
    createGroup(requestDetails: createGroupDTO): Promise<number>;
    addDisToGroup(requestDetails: disToGroupDTO): Promise<number>;
    removeDisFromGroup(requestDetails: disToGroupDTO): Promise<number>;

    approveRound(approveDetails: approveRoundDTO): Promise<boolean>;
}
