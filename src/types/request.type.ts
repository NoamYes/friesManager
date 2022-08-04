import { RESPONSIBILITY_PERM, APPROVAL_ROUND_STATUS, GROUP_TYPE, REQUEST_STATUS } from './../config/enums';
import { Types } from 'mongoose';
import { REQUEST_TYPE } from '../config/enums';

// type Content = {
//     _id?: Types.ObjectId;
//     type: REQUEST_TYPE;
//     password?: string;
//     createdAt?: Date;
//     updatedAt?: Date;
// };

type request = {
    _id?: Types.ObjectId;
    type: REQUEST_TYPE;
    applicant: string;
    createdAt: Date;
    updatedAt: Date;
    approvalsNeeded?: approvalRound[];
    status: REQUEST_STATUS;
};

type approvalRound = {
    permissionResponsibility: {
        type: RESPONSIBILITY_PERM;
        authorityId: String;
    };
    status: APPROVAL_ROUND_STATUS;
};

type createGroupRequest = request & {
    name: string;
    types: GROUP_TYPE[];
    admin: string;
    clearance?: string;
};

type disToGroup = request & {
    groupId: Types.ObjectId;
    disUniqueId: string[];
};

type entitiesToGroup = request & {
    groupId: Types.ObjectId;
    entitiesId: string[];
}

type renameGroup = request & {
    groupId: Types.ObjectId;
    name: string;
}

type adminsToGroup = request & {
    groupId: Types.ObjectId;
    adminsId: string[];
}

type changeClearanceToGroup = request & {
    groupId: Types.ObjectId;
    clearance: string;
}

export { request, createGroupRequest, disToGroup, entitiesToGroup, approvalRound, renameGroup, adminsToGroup, changeClearanceToGroup };
