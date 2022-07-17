import { IGroupRepo } from '../../../interfaces/group.interface';
import { IGroupService } from '../../../interfaces/groupService.interface';
import { createGroupDTO, disToGroupDTO } from './DTO';
import { Group } from '../../../domain/group';
import { BadRequestError, InternalError, NotFoundError } from '../../utils/error';

export default class implements IGroupService {
    private _repo: IGroupRepo;

    constructor(repo: IGroupRepo) {
        this._repo = repo;
    }

    public async createGroup(dto: createGroupDTO): Promise<string> {
        const existsRequest = await this._repo.findOne({ name: dto.name });

        if (existsRequest) throw new BadRequestError(`Group with name ${dto.name} already exists`);

        const newGroup = Group.createNew(dto);

        const res = await this._repo.create(newGroup);

        if (!res) throw new InternalError(`Error Creating Group: ${dto.name}`);

        return newGroup.id!.toString();
    }

    public async addDisToGroup(dto: disToGroupDTO): Promise<boolean> {
        const group = await this._repo.findById(dto.groupId);

        if (!group) throw new NotFoundError(`Group Not Found`);

        group.addDis(dto.disUniqueId);

        const res = await this._repo.save(group);

        if (!res) throw new InternalError(`Error adding dis to group: ${group.name}`);

        return true;
    }

    public async removeDisFromGroup(dto: disToGroupDTO): Promise<boolean> {
        const group = await this._repo.findById(dto.groupId);

        if (!group) throw new NotFoundError(`Group Not Found`);

        group.removeDis(dto.disUniqueId);

        const res = await this._repo.save(group);

        if (!res) throw new InternalError(`Error adding dis to group: ${group.name}`);

        return true;
    }

}
