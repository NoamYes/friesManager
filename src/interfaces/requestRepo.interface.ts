import { GROUP_TYPE } from './../config/enums';
import { ApprovalRound } from '../types/request.type';

export interface IRequestRepo {
    createGroupRequest(name: string, applicant: string, types: GROUP_TYPE[], approvalRounds: ApprovalRound[]): Promise<boolean>;
    addDIsToGroupRequest(groupId: string, applicant: string, uniqueIds: string[], approvalRounds: ApprovalRound[]): Promise<boolean>;
}
