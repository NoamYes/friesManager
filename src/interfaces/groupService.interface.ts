import { createGroupDTO, disToGroupDTO } from '../services/group/DTO';

export interface IGroupService {
    createGroup(dto: createGroupDTO): Promise<string>;
    addDisToGroup(dto: disToGroupDTO): Promise<boolean>;
    removeDisFromGroup(dto: disToGroupDTO): Promise<boolean>;
}
