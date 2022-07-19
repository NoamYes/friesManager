import mongoose, { Types } from 'mongoose';
import { MongoError } from '../../express/utils/error';
import { Group } from '../../domain/group';
import { GroupDoc } from '../models/group.model';
import { groupQuery, IGroupRepo } from '../../interfaces/group.interface';

export default class implements IGroupRepo {
    private _model: mongoose.Model<GroupDoc>;

    constructor(model: mongoose.Model<GroupDoc>) {
        this._model = model;
    }

    public create = async (group: Group): Promise<boolean> => {
        try {
            const doc: GroupDoc = Group.toPersistance(group);
            const res = await this._model.create(doc);
            return !!res;
        } catch (err: any) {
            console.log(err.message);
            throw new MongoError(err.message);
        }
    };

    public save = async (group: Group): Promise<boolean> => {
        try {
            const doc: GroupDoc = Group.toPersistance(group);
            const res = await this._model.updateOne({ _id: doc._id }, { $set: doc });
            return !!res;
        } catch (err: any) {
            console.log(err.message);
            throw new MongoError(err.message);
        }
    };

    public findById = async (id: string): Promise<Group | null> => {
        const res = await this._model.findOne({ _id: new Types.ObjectId(id) }).lean();

        if (!res) return null;

        return Group.toDomain(res);
    };

    public findOne = async (query: groupQuery): Promise<Group | null> => {
        const res = await this._model.findOne(query).lean();

        if (!res) return null;

        return Group.toDomain(res);
    };

    public findMany = async (query: groupQuery): Promise<Group[]> => {
        const res = await this._model.find(query).lean();
        return res.map((group) => Group.toDomain(group));
    };
}
