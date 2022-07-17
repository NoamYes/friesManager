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
