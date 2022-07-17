import { Types } from 'mongoose';
import { Group } from '../domain/group';

export type groupQuery = {
    name?: string;
};
export interface IGroupRepo {
    findById(id: Types.ObjectId): Promise<Group | null>;
    findOne(query: groupQuery): Promise<Group | null>;
    save(group: Group): Promise<boolean>;
    create(group: Group): Promise<boolean>;
}
