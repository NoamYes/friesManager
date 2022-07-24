import { GROUP_TYPE } from '../../config/enums';
import * as mongoose from 'mongoose';
import config from '../../config';
const { mongo } = config;

export type groupEntity = {
    id: string;
    dis: string[];
};
export interface GroupDoc {
    _id: mongoose.Types.ObjectId;
    name: string; // TODO: is unique?
    types: GROUP_TYPE[];
    clearance?: string;
    entities: groupEntity[];
    dis: string[];
    admins: string[]; // TODO: admins are entities id? users?
    subGroups: mongoose.Types.ObjectId[]; // TODO: refer: itself
    kartoffelSubGroups: string[]; // TODO: Relevance ?
    createdAt: Date;
    updatedAt: Date;
}

const groupEntitySchema = new mongoose.Schema<groupEntity>({
    id: String,
    dis: [String],
});

const groupSchema = new mongoose.Schema<GroupDoc>(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, required: false },
        name: { type: String, required: true, unique: true }, // TODO: is unique?
        types: { type: [String], enum: GROUP_TYPE, required: true },
        clearance: { type: String, required: false },
        entities: { type: [groupEntitySchema], required: true },
        dis: { type: [String], required: true },
        admins: { type: [String], required: true }, // TODO: admins are entities id? users?
        subGroups: { type: [mongoose.Schema.Types.ObjectId], required: false }, // TODO: refer: itself
        kartoffelSubGroups: { type: [String] }, // TODO: Relevance ?
        createdAt: { type: Date, required: false },
        updatedAt: { type: Date, required: false },
    },
    { versionKey: false },
);

const groupModel = mongoose.model<GroupDoc>(mongo.groupCollectionName, groupSchema);

export default groupModel;
