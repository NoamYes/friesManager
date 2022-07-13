import { Types } from 'mongoose';
import { Request } from '../domain/request';
import { REQUEST_TYPE } from './../config/enums';
// import { ApprovalRound } from '../types/request.type';

export type requestQuery = {
    id?: string;
    name?: string;
    _id?: Types.ObjectId;
};
export interface IRequestRepo {
    // createGroupRequest(name: string, applicant: string, types: GROUP_TYPE[], approvalsNeeded: ApprovalRound[]): Promise<boolean>;
    // addDIsToGroupRequest(groupId: string, applicant: string, uniqueIds: string[], approvalsNeeded: ApprovalRound[]): Promise<boolean>;
    // create(document: any, query?: requestQuery): Promise<boolean>;
    findById(id: string): Promise<Request | null>;
    findOne(query: requestQuery, requestType: REQUEST_TYPE): Promise<Request | null>;
    save(id: string, request: Request, requestType: REQUEST_TYPE): Promise<boolean>;
    create(request: Request, requestType: REQUEST_TYPE): Promise<boolean>;
}
