import { approveRoundDTO, createGroupDTO, disToGroupDTO, entitiesDTO } from '../express/joi/validator/request.schema';

export interface IRequestUseCases {
    create(requestDetails: createGroupDTO): Promise<number>;
    addDis(requestDetails: disToGroupDTO): Promise<number>;
    removeDis(requestDetails: disToGroupDTO): Promise<number>;
    addEntities(requestDetails: entitiesDTO): Promise<number>;
    removeEntities(requestDetails: entitiesDTO): Promise<number>;

    approveRound(approveDetails: approveRoundDTO): Promise<boolean>;
}
