import { createGroupDTO, disToGroupDTO, entitiesDTO, renameDTO, adminsDTO, changeClearanceDTO } from '../services/group/DTO';

export interface IGroupService {
    createGroup(dto: createGroupDTO): Promise<string>;
    addDisToGroup(dto: disToGroupDTO): Promise<boolean>;
    removeDisFromGroup(dto: disToGroupDTO): Promise<boolean>;
    addEntities(dto: entitiesDTO): Promise<boolean>;
    removeEntities(dto: entitiesDTO): Promise<boolean>;
    rename(dto: renameDTO): Promise<boolean>;
    addAdmins(dto: adminsDTO): Promise<boolean>;
    removeAdmins(dto: adminsDTO): Promise<boolean>;
    changeClearance(dto: changeClearanceDTO);
}
