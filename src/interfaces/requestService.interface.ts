import { createGroupDTO } from '../express/joi/validator/request.schema';
import Blog from '../types/group.type';

export interface IRequestService {
    createGroup(group: createGroupDTO): Promise<void>;
    addDisToGroup(blogId: string, description: string): Promise<Blog | null>;
}
