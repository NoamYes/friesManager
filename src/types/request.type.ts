import { RESPONSIBILITY_PERM, APPROVAL_ROUND_STATUS, GROUP_TYPE } from './../config/enums';
import { Types } from 'mongoose';
import { REQUEST_TYPE } from '../config/enums';

// type Content = {
//     _id?: Types.ObjectId;
//     type: REQUEST_TYPE;
//     password?: string;
//     createdAt?: Date;
//     updatedAt?: Date;
// };

type Request = {
    _id?: Types.ObjectId;
    type: REQUEST_TYPE;
    applicant: string;
    createdAt: Date;
    updatedAt: Date;
    approvalRounds?: ApprovalRound[];
};

type ApprovalRound = {
    permissionResponsibility: {
        type: RESPONSIBILITY_PERM;
        id: Types.ObjectId;
    };
    status: APPROVAL_ROUND_STATUS;
};

type CreateGroupRequest = Request & {
    name: string;
    types: GROUP_TYPE[];
};

type AddDisToGroup = Request & {
    groupId: Types.ObjectId;
    disUniquedId: string[];
};

export { Request, CreateGroupRequest, AddDisToGroup, ApprovalRound };
