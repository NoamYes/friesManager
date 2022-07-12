import { GROUP_TYPE } from '../../config/enums';
import * as mongoose from 'mongoose';
import config from '../../config';
import Group from '../../types/group.type';

const { mongo } = config;

const groupSchema = new mongoose.Schema<Group>(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, required: false, auto: true, select: true },
        name: { type: String, required: true, unique: true }, // TODO: is unique?
        types: { type: [String], enum: GROUP_TYPE, required: true },
        clearance: { type: String, required: true },
        groupDIs: { type: [mongoose.Schema.Types.ObjectId], required: true },
        admins: { type: [mongoose.Schema.Types.ObjectId], required: true }, // TODO: admins are entities id? users?
        subGroups: { type: [mongoose.Schema.Types.ObjectId], required: false },
        kartoffelSubGroups: { type: [mongoose.Schema.Types.ObjectId] },
        createdAt: { type: Date, required: false },
        updatedAt: { type: Date, required: false },
    },
    { versionKey: false },
);

const groupModel = mongoose.model<Group>(mongo.groupCollectionName, groupSchema);

export default groupModel;
