import { GROUP_TYPE } from './../config/enums';
import { Types } from 'mongoose';

type Group = {
    _id: string | object; // objectId
    name: string;
    types: GROUP_TYPE[]; // TODO: should rename?
    clearance: string;
    // TODO: entities?
    dis: Types.ObjectId[]; // objectId
    admins: Types.ObjectId[]; // TODO: admins are entities id? users?
    subGroups: Types.ObjectId[];
    kartoffelSubGroups?: Types.ObjectId[]; // TODO: what should it supply?
    createdAt: Date;
    updatedAt: Date; // TODO: consider its meaning
};

export default Group;
