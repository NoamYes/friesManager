import { IGroupRepo } from '../../interfaces/group.interface';
import { IGroupService } from '../../interfaces/groupService.interface';
import { createGroupDTO, disToGroupDTO } from './DTO';
import { Group } from '../../domain/group';
import { BadRequestError, InternalError, NotFoundError } from '../../express/utils/error';

export default class implements IGroupService {
    private _repo: IGroupRepo;

    constructor(repo: IGroupRepo) {
        this._repo = repo;
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
}
