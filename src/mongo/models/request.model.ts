import { REQUEST_TYPE, GROUP_TYPE, RESPONSIBILITY_PERM, APPROVAL_ROUND_STATUS } from './../../config/enums';
import mongoose, { Types } from 'mongoose';
import config from '../../config/config';
import { ApprovalRound, AddDisToGroup } from '../../types/request.type';

const requestOptions = {
    discriminatorKey: 'type',
    collection: config.mongo.requestCollectionName,
};

export interface RequestDoc {
    _id: Types.ObjectId;
    type: REQUEST_TYPE;
    applicant: string;
    createdAt: Date;
    updatedAt: Date;
    approvalRounds?: ApprovalRound[];
}

// TODO: add global status request
export const requestSchema = new mongoose.Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
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

export const RequestModel = mongoose.model('Request', requestSchema);

const CreateRequestModel = RequestModel.discriminator<CreateRequest>(
    REQUEST_TYPE.CREATE_GROUP,
    new mongoose.Schema<CreateRequest>({
        name: { type: String, required: true, unique: true },
        types: { type: [String], enum: GROUP_TYPE, required: true },
        approvalRounds: { type: [createGroupApprovalSchema], required: false },
    }),
);

const AddDiToGroupRequestModel = RequestModel.discriminator<AddDisToGroup>(
    REQUEST_TYPE.ADD_DIS_GROUP,
    new mongoose.Schema<AddDisToGroup>({
        groupId: { type: mongoose.Schema.Types.ObjectId, required: true },
        disUniquedId: { type: [String], required: true },
        approvalRounds: { type: [createGroupApprovalSchema], required: false },
    }),
);

export const modelsMap = {
    [REQUEST_TYPE.BASE_REQ]: RequestModel,
    [REQUEST_TYPE.CREATE_GROUP]: CreateRequestModel,
    [REQUEST_TYPE.ADD_DIS_GROUP]: AddDiToGroupRequestModel,
};
export { CreateRequestModel, AddDiToGroupRequestModel };
