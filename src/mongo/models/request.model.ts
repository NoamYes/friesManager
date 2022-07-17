import { REQUEST_TYPE, GROUP_TYPE, RESPONSIBILITY_PERM, APPROVAL_ROUND_STATUS, REQUEST_STATUS } from './../../config/enums';
import mongoose, { Types } from 'mongoose';
import config from '../../config';
import { approvalRound, disToGroup, createGroupRequest } from '../../types/request.type';

const requestOptions = {
    discriminatorKey: 'type',
    collection: config.mongo.requestCollectionName,
};

export interface RequestDoc {
    _id: Types.ObjectId;
    requestNumber: number;
    type: REQUEST_TYPE;
    applicant: string;
    createdAt: Date;
    updatedAt: Date;
    approvalRounds?: approvalRound[];
    status: REQUEST_STATUS;
}

export const createGroupApprovalSchema = new mongoose.Schema<approvalRound>({
    permissionResponsibility: {
        type: { type: String, enum: RESPONSIBILITY_PERM, required: true },
        authorityId: { type: String, required: true },
    },
    status: { type: String, enum: APPROVAL_ROUND_STATUS, required: true },
});

export const requestSchema = new mongoose.Schema<RequestDoc>(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        requestNumber: { type: Number, required: true, unique: true },
        type: { type: String, enum: REQUEST_TYPE, required: true },
        status: { type: String, enums: REQUEST_STATUS, required: true },
        applicant: { type: String, required: true },
        createdAt: { type: Date, required: false },
        updatedAt: { type: Date, required: false },
        approvalRounds: { type: [createGroupApprovalSchema], required: false },
    }, {
    // versionKey: false,
    ...requestOptions
}
);

export const RequestModel = mongoose.model('Request', requestSchema);

const CreateGroupRequestModel = RequestModel.discriminator<createGroupRequest>(
    REQUEST_TYPE.CREATE_GROUP,
    new mongoose.Schema<createGroupRequest>({
        name: { type: String, required: true, unique: true },
        types: { type: [String], enum: GROUP_TYPE, required: true },
        admin: { type: String, required: true },
        clearance: { type: String, required: false }
    }),
);

const AddDiToGroupRequestModel = RequestModel.discriminator<disToGroup>(
    REQUEST_TYPE.ADD_DIS_GROUP,
    new mongoose.Schema<disToGroup>({
        groupId: { type: mongoose.Schema.Types.ObjectId, required: true }, //TODO: refer ?
        disUniqueId: { type: [String], required: true },
    }),
);

export const modelsMap = {
    [REQUEST_TYPE.BASE_REQ]: RequestModel,
    [REQUEST_TYPE.CREATE_GROUP]: CreateGroupRequestModel,
    [REQUEST_TYPE.ADD_DIS_GROUP]: AddDiToGroupRequestModel,
};

export { CreateGroupRequestModel, AddDiToGroupRequestModel };
