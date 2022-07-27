import { IGroupRepo } from '../../interfaces/group.interface';
import { IGroupService } from '../../interfaces/groupService.interface';
import { createGroupDTO, disToGroupDTO, entitiesDTO, renameDTO } from './DTO';
import { Group } from '../../domain/group';
import { BadRequestError, InternalError, NotFoundError } from '../../express/utils/error';
import { groupEntity } from '../../mongo/models/group.model';
import IKartoffelService from '../../interfaces/kartoffelService.interface';

export default class implements IGroupService {
    private _repo: IGroupRepo;
    private _kartoffelService: IKartoffelService;

    constructor(repo: IGroupRepo, kartoffelService: IKartoffelService) {
        this._repo = repo;
        this._kartoffelService = kartoffelService;
    }

    public createGroup = async (dto: createGroupDTO): Promise<string> => {
        const existsRequest = await this._repo.findOne({ name: dto.name });

        if (existsRequest) throw new BadRequestError(`Group with name ${dto.name} already exists`);

        const newGroup = Group.createNew(dto);

        const res = await this._repo.create(newGroup);

        if (!res) throw new InternalError(`Error Creating Group: ${dto.name}`);

        return newGroup.id!.toString();
    };

    public addDisToGroup = async (dto: disToGroupDTO): Promise<boolean> => {
        const group = await this._repo.findById(dto.groupId.toString());

        if (!group) throw new NotFoundError(`Group Not Found`);

        group.addDis(dto.disUniqueId);

        const res = await this._repo.save(group);

        if (!res) throw new InternalError(`Error adding dis to group: ${group.name}`);

        return true;
    };

    public removeDisFromGroup = async (dto: disToGroupDTO): Promise<boolean> => {
        const group = await this._repo.findById(dto.groupId.toString());

        if (!group) throw new NotFoundError(`Group Not Found`);

        group.removeDis(dto.disUniqueId);

        const res = await this._repo.save(group);

        if (!res) throw new InternalError(`Error adding dis to group: ${group.name}`);

        return true;
    };

    public addEntities = async (dto: entitiesDTO): Promise<boolean> => {
        const group = await this._repo.findById(dto.groupId.toString());

        if (!group) throw new NotFoundError(`Group Not Found`);

        const entities: groupEntity[] = [];
        let disUniqueId: string[] = [];

        for (const id of dto.entitiesId) {
            if (group.entities.some(entity => entity.id === id)) throw new BadRequestError(`Entity ${id} already in group`);

            disUniqueId = await this._kartoffelService.getEntityDis(id);

            entities.push({
                id,
                dis: disUniqueId
            })
        }

        group.addEntities(entities);

        const res = await this._repo.save(group);

        if (!res) throw new InternalError(`Error adding entities to group: ${group.name}`);

        return true;
    }

    public removeEntities = async (dto: entitiesDTO): Promise<boolean> => {
        const group = await this._repo.findById(dto.groupId.toString());

        if (!group) throw new NotFoundError(`Group Not Found`);

        group.removeEntities(dto.entitiesId);

        const res = await this._repo.save(group);

        if (!res) throw new InternalError(`Error removing entities to group: ${group.name}`);

        return true;
    }

    public rename = async (dto: renameDTO): Promise<boolean> => {
        const group = await this._repo.findById(dto.groupId.toString());

        if (!group) throw new NotFoundError(`Group Not Found`);

        group.rename(dto.name);

        const res = await this._repo.save(group);

        if (!res) throw new InternalError(`Error Renaming group: ${group.id.toString()}`);

        return true;
    }
}
