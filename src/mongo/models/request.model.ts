import { REQUEST_TYPE, GROUP_TYPE, RESPONSIBILITY_PERM, APPROVAL_ROUND_STATUS } from './../../config/enums';
import mongoose from 'mongoose';
import config from '../../config/config';
import { CreateRequest, Request, ApprovalRound, AddDisToGroup } from '../../types/request.type';

const requestOptions = {
    discriminatorKey: 'type',
    collection: config.mongo.requestCollectionName,
};

// export interface RequestDoc {
//     _id: mongoose.Schema.Types.ObjectId;
//     type: { type: String; enum: REQUEST_TYPE; required: true };
//     applicant: { type: mongoose.Schema.Types.ObjectId; required: true };
//     createdAt: { type: Date; required: false };
//     updatedAt: { type: Date; required: false };
// }

export const requestSchema = new mongoose.Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, required: false, auto: true, select: true },
        type: { type: String, enum: REQUEST_TYPE, required: true },
        applicant: { type: mongoose.Schema.Types.ObjectId, required: true },
        createdAt: { type: Date, required: false },
        updatedAt: { type: Date, required: false },
    },
    { ...requestOptions, ...{ versionKey: false } },
);

export const createGroupApprovalSchema = new mongoose.Schema<ApprovalRound>({
    permissionResponsibility: {
        type: { type: String, enum: RESPONSIBILITY_PERM, required: true },
        id: { type: mongoose.Schema.Types.ObjectId, required: true },
    },
    status: { type: String, enum: APPROVAL_ROUND_STATUS, required: true },
});

const Request = mongoose.model('Request', requestSchema);

const CreateRequestModel = Request.discriminator<CreateRequest>(
    REQUEST_TYPE.CREATE_GROUP,
    new mongoose.Schema<CreateRequest>({
        name: { type: String, required: true, unique: true },
        types: { type: [String], enum: GROUP_TYPE, required: true },
        approvalRounds: { type: [createGroupApprovalSchema], required: false },
    }),
);

const AddDiToGroupRequest = Request.discriminator<AddDisToGroup>(
    REQUEST_TYPE.ADD_DIS_GROUP,
    new mongoose.Schema<AddDisToGroup>({
        groupId: { type: mongoose.Schema.Types.ObjectId, required: true },
        disUniquedId: { type: [String], required: true },
        approvalRounds: { type: [createGroupApprovalSchema], required: false },
    }),
);

export { CreateRequestModel, AddDiToGroupRequest };
