import { NotFoundError } from '../express/utils/error';
import { IGroupUseCases } from '../interfaces/groups/useCases.interface';
import { IGroupRepo } from '../interfaces/group.interface';
import { Group } from '../domain/group';

import { GROUP_TYPE } from '../config/enums';

export type groupResponseDTO = {
    _id: string;
    name: string;
    types: GROUP_TYPE[];
    clearance?: string;
    groupDis: string[];
    admins: string[];
    subGroups: string[];
    kartoffelSubGroups: string[];
    createdAt: Date;
    updatedAt: Date;
}

export default class implements IGroupUseCases {
    private _repo: IGroupRepo;

    constructor(repo: IGroupRepo) {
        this._repo = repo;
    }

    private toResponseDTO = (group: Group): groupResponseDTO => {
        return {
            _id: group.id.toString(),
            name: group.name,
            types: group.types,
            ...(group.clearance ? { clearance: group.clearance } : {}),
            groupDis: group.groupDis,
            admins: group.admins,
            subGroups: group.subGroups.map(id => id.toString()),
            kartoffelSubGroups: group.kartoffelSubGroups,
            createdAt: group.createdAt,
            updatedAt: group.updatedAt,
        }
    }

    public getById = async (id: string): Promise<groupResponseDTO> => {
        const group: Group | null = await this._repo.findById(id);

        if (!group) throw new NotFoundError(`Group with id: ${id} not found`);

        return this.toResponseDTO(group);
    }

    public getByName = async (name: string): Promise<groupResponseDTO> => {
        const group: Group | null = await this._repo.findOne({ name });

        if (!group) throw new NotFoundError(`Group with name: ${name} not found`);

        return this.toResponseDTO(group);
    }

    public getByAdminId = async (id: string): Promise<groupResponseDTO[]> => {
        const groups: Group[] = await this._repo.findMany({ admins: id });

        if (!groups.length) throw new NotFoundError(`Group where ${id} is admin are not found`);

        return groups.map(group => this.toResponseDTO(group));
    }
}
