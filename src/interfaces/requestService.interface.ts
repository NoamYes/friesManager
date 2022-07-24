import { approveRoundDTO, createGroupDTO, disToGroupDTO, addEntitiesDTO } from '../express/joi/validator/request.schema';

export interface IRequestUseCases {
    create(requestDetails: createGroupDTO): Promise<number>;
    addDis(requestDetails: disToGroupDTO): Promise<number>;
    removeDis(requestDetails: disToGroupDTO): Promise<number>;
    addEntities(requestDetails: addEntitiesDTO): Promise<number>;

    approveRound(approveDetails: approveRoundDTO): Promise<boolean>;
}
