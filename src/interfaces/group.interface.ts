import { Group } from '../domain/group';

export type groupQuery = {
    name?: string;
    admins?: string;
};
export interface IGroupRepo {
    findById(id: string): Promise<Group | null>;
    findOne(query: groupQuery): Promise<Group | null>;
    findMany(query: groupQuery): Promise<Group[]>;
    save(group: Group): Promise<boolean>;
    create(group: Group): Promise<boolean>;
}
