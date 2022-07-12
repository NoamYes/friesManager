import { REQUEST_TYPE } from './../config/enums';
// import { ApprovalRound } from '../types/request.type';

export type requestQuery = {
    id?: string;
    name?: string;
};
export interface IRequestRepo {
    // createGroupRequest(name: string, applicant: string, types: GROUP_TYPE[], approvalRounds: ApprovalRound[]): Promise<boolean>;
    // addDIsToGroupRequest(groupId: string, applicant: string, uniqueIds: string[], approvalRounds: ApprovalRound[]): Promise<boolean>;
    // create(document: any, query?: requestQuery): Promise<boolean>;
    find(query: requestQuery, requestType: REQUEST_TYPE): Promise<boolean>;
    save(doc: any, requestType: REQUEST_TYPE, query: requestQuery): Promise<boolean>;
    create(doc: any, requestType: REQUEST_TYPE): Promise<boolean>;
}
