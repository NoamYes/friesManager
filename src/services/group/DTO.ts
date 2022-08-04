import { Types } from 'mongoose';
import { GROUP_TYPE } from '../../config/enums';

export type createGroupDTO = {
    name: string;
    types: [GROUP_TYPE];
    admin: string;
};

export type disToGroupDTO = {
    groupId: Types.ObjectId;
    disUniqueId: string[];
};

export type entitiesDTO = {
    groupId: Types.ObjectId;
    entitiesId: string[];
}

export type renameDTO = {
    groupId: Types.ObjectId;
    name: string;
}

export type adminsDTO = {
    groupId: Types.ObjectId;
    adminsId: string[];
}

export type changeClearanceDTO = {
    groupId: Types.ObjectId;
    clearance: string;
}

export type deleteGroupDTO = {
    groupId: Types.ObjectId;
}
