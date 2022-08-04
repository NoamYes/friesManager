import { adminsDTO, approveRoundDTO, changeClearanceDTO, createGroupDTO, disToGroupDTO, entitiesDTO, renameDTO, deleteGroupDTO } from '../express/joi/validator/request.schema';

export interface IRequestUseCases {
    create(requestDetails: createGroupDTO): Promise<number>;
    addDis(requestDetails: disToGroupDTO): Promise<number>;
    removeDis(requestDetails: disToGroupDTO): Promise<number>;
    addEntities(requestDetails: entitiesDTO): Promise<number>;
    removeEntities(requestDetails: entitiesDTO): Promise<number>;
    rename(requestDetails: renameDTO): Promise<number>;
    addAdmins(requestDetails: adminsDTO): Promise<number>;
    removeAdmins(requestDetails: adminsDTO): Promise<number>;
    changeClearance(requestDetails: changeClearanceDTO): Promise<number>;
    deleteGroup(requestDetails: deleteGroupDTO): Promise<number>;

    approveRound(approveDetails: approveRoundDTO): Promise<boolean>;
}
