import mongoose, { Mongoose } from 'mongoose';
import { GROUP_TYPE, REQUEST_TYPE } from '../../config/enums';
import { IRequestRepo } from '../../interfaces/requestRepo.interface';
import { AddDisToGroup, ApprovalRound, CreateGroupRequest } from '../../types/request.type';

export class RequestRepo implements IRequestRepo {
    private createGroupRequestModel: mongoose.Model<CreateGroupRequest>;
    private addDisToGroupRequestModel: mongoose.Model<AddDisToGroup>;

    constructor(createGroupRequestModel: mongoose.Model<CreateGroupRequest>, addDisToGroupRequestModel: mongoose.Model<AddDisToGroup>) {
        this.createGroupRequestModel = createGroupRequestModel;
        this.addDisToGroupRequestModel = addDisToGroupRequestModel;
    }

    public getCreateGroupRequestByQuery = async (query: any) => {
        return await this.createGroupRequestModel.findOne(query);
    };

    public createGroupRequest = async (name: string, applicant: string, types: GROUP_TYPE[], approvalRounds: ApprovalRound[]): Promise<boolean> => {
        const now = new Date();

        const createGroupReq: CreateGroupRequest = {
            // TODO: would be happy to refactor into class and persistance/domain mappers
            name,
            applicant,
            types,
            approvalRounds,
            type: REQUEST_TYPE.CREATE_GROUP,
            updatedAt: now,
            createdAt: now,
        };

        const result = await this.createGroupRequestModel.create(createGroupReq);

        return !!result;
    };

    public addDIsToGroupRequest = (groupId: string, applicant: string, uniqueIds: string[], approvalRounds: ApprovalRound[]): Promise<boolean> => {
        const now = new Date(); // TODO: should be mongo responsibility?

        const addDisGroupReq: AddDisToGroup = {
            // TODO: would be happy to refactor into class and persistance/domain mappers
            applicant,
            approvalRounds,
            disUniquedId: uniqueIds,
            type: REQUEST_TYPE.ADD_DIS_GROUP,
            updatedAt: now,
            createdAt: now,
        };

        const newUser = await this.addDisToGroupRequestModel.create(user);
        return newUser;
    };
}
