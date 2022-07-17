import { GROUP_TYPE } from '../config/enums';
import { Types } from 'mongoose';
import { GroupDoc } from '../mongo/models/group.model';

export type newGroupProps = {
    name: string;
    types: GROUP_TYPE[],
    admin: string, // TODO: think about it
    clearance?: string,
};


export interface GroupState {
    _id: Types.ObjectId,
    name: string, // TODO: is unique?
    types: GROUP_TYPE[],
    clearance?: string,
    groupDis: string[]
    admins: string[], // TODO: admins are entities id? users?
    subGroups: Types.ObjectId[], // TODO: refer: itself
    kartoffelSubGroups: string[], // TODO: Relevance ?
    createdAt: Date,
    updatedAt: Date,
}

export class Group {
    private _id: Types.ObjectId;
    private _name: string; // TODO: is unique?
    private _types: GROUP_TYPE[];
    private _clearance?: string;
    private _groupDis: string[]
    private _admins: string[]; // TODO: admins are entities id? users?
    private _subGroups: Types.ObjectId[]; // TODO: refer: itself
    private _kartoffelSubGroups: string[]; // TODO: Relevance ?
    private _createdAt: Date;
    private _updatedAt: Date;

    protected constructor(props: GroupState) {
        this._id = props._id;
        this._name = props.name;
        this._types = props.types;
        this._clearance = props.clearance;
        this._groupDis = props.groupDis;
        this._admins = props.admins;
        this._subGroups = props.subGroups;
        this._kartoffelSubGroups = props.kartoffelSubGroups;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get types() {
        return this._types;
    }

    get clearance() {
        return this._clearance;
    }

    get groupDis() {
        return this._groupDis;
    }

    get admins() {
        return this._admins;
    }

    get subGroups() {
        return this._subGroups;
    }

    get kartoffelSubGroups() {
        return this._kartoffelSubGroups;
    }

    get updatedAt() {
        return this._updatedAt;
    }

    get createdAt() {
        return this._createdAt;
    }

    public addDis(disUniqueId: string[]) {
        this._groupDis.push(...disUniqueId); // TODO: toLowerCase ?
        this._groupDis = [...new Set(this.groupDis)];
    }

    public removeDis(disUniqueId: string[]) {
        this._groupDis = this.groupDis.filter((uniqueId) => !disUniqueId.includes(uniqueId));
    }

    static create(state: GroupState): Group {
        return new Group(state);
    }

    static createNew(props: newGroupProps): Group {
        const now = new Date();

        const newGroupState: GroupState = {
            _id: new Types.ObjectId(),
            createdAt: now, // TODO: let mongo decide ?
            updatedAt: now,
            name: props.name,
            types: props.types,
            ...(props.clearance ? { clearance: props.clearance } : {}),
            admins: [props.admin],
            subGroups: [],
            kartoffelSubGroups: [],
            groupDis: [],
        };

        return new Group(newGroupState);
    }

    static toPersistance(group: Group): GroupDoc {
        return {
            _id: new Types.ObjectId(group._id),
            types: group.types,
            createdAt: group.createdAt,
            updatedAt: group.updatedAt,
            name: group.name,
            admins: group.admins,
            subGroups: group.subGroups,
            kartoffelSubGroups: group.kartoffelSubGroups,
            groupDis: group.groupDis,
            clearance: group.clearance
        };
    }

    static toDomain(raw: GroupDoc): Group {
        return Group.create(raw);
    }
}