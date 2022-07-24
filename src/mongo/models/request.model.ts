import { REQUEST_TYPE, GROUP_TYPE, RESPONSIBILITY_PERM, APPROVAL_ROUND_STATUS, REQUEST_STATUS } from './../../config/enums';
import mongoose, { Types } from 'mongoose';
import config from '../../config';
import { approvalRound, disToGroup, createGroupRequest, entitiesToGroup } from '../../types/request.type';

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

export const approvalSchema = new mongoose.Schema<approvalRound>({
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
        approvalRounds: { type: [approvalSchema], required: false },
    },
    {
        // versionKey: false,
        ...requestOptions,
    },
);

export const RequestModel = mongoose.model('Request', requestSchema);

const CreateGroupRequestModel = RequestModel.discriminator<createGroupRequest>(
    REQUEST_TYPE.CREATE,
    new mongoose.Schema<createGroupRequest>({
        name: { type: String, required: true, unique: true },
        types: { type: [String], enum: GROUP_TYPE, required: true },
        admin: { type: String, required: true },
        clearance: { type: String, required: false },
    }),
);

const AddDiToGroupRequestModel = RequestModel.discriminator<disToGroup>(
    REQUEST_TYPE.ADD_DIS,
    new mongoose.Schema<disToGroup>({
        groupId: { type: mongoose.Schema.Types.ObjectId, required: true }, //TODO: refer ?
        disUniqueId: { type: [String], required: true },
    }),
);

const AddEntitiesToGroupRequestModel = RequestModel.discriminator<entitiesToGroup>(
    REQUEST_TYPE.ADD_ENTITIES,
    new mongoose.Schema<entitiesToGroup>({
        groupId: { type: mongoose.Schema.Types.ObjectId, required: true }, //TODO: refer ?
        entitiesId: { type: [String], required: true },
    }),
);

export const modelsMap = {
    [REQUEST_TYPE.BASE_REQ]: RequestModel,
    [REQUEST_TYPE.CREATE]: CreateGroupRequestModel,
    [REQUEST_TYPE.ADD_DIS]: AddDiToGroupRequestModel,
    [REQUEST_TYPE.ADD_ENTITIES]: AddEntitiesToGroupRequestModel
};

export { CreateGroupRequestModel, AddDiToGroupRequestModel, AddEntitiesToGroupRequestModel };
