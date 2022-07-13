import { createGroupDTO } from '../express/joi/validator/request.schema';

export interface IRequestService {
    createCreateGroup(group: createGroupDTO): Promise<string>;
    approveRound(requestId: string, authorityId: string, approved: boolean): Promise<boolean>;
    // updateCreateGroup(group: createGroupDTO): Promise<boolean>;
    // addDisToGroup(blogId: string, description: string): Promise<Blog | null>;
}
