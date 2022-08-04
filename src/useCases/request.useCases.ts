import { InternalError, BadRequestError, NotFoundError } from '../express/utils/error';
import { IRequestRepo } from '../interfaces/requestRepo.interface';
import { entitiesDTO, approveRoundDTO, createGroupDTO, disToGroupDTO, renameDTO, adminsDTO, changeClearanceDTO } from '../express/joi/validator/request.schema';
import { IRequestUseCases } from '../interfaces/requestService.interface';
import { REQUEST_TYPE } from '../config/enums';
import { Request } from '../domain/request';
import { IGroupRepo } from '../interfaces/group.interface';
import { Types } from 'mongoose';

export default class implements IRequestUseCases {
    private requestRepo: IRequestRepo;
    private groupRepo: IGroupRepo;

    constructor(requestRepo: IRequestRepo, groupRepo: IGroupRepo) {
        this.requestRepo = requestRepo;
        this.groupRepo = groupRepo;
    }

    //TODO: return request number instead of request id
    public create = async (requestDetails: createGroupDTO): Promise<number> => {
        const existsGroup = await this.groupRepo.findOne({ name: requestDetails.name });

        if (existsGroup) throw new BadRequestError(`Group with the name ${requestDetails.name} already exists`);

        const existsRequest = await this.requestRepo.findOne({ name: requestDetails.name }, REQUEST_TYPE.CREATE);

        if (existsRequest) throw new BadRequestError(`Create request of a group with the name ${requestDetails.name} already exists`);

        const { applicant, approvalsNeeded } = requestDetails;
        const requestProps = { type: REQUEST_TYPE.CREATE, applicant, approvalsNeeded };
        const payload = {
            name: requestDetails.name,
            types: requestDetails.types,
            admin: applicant,
            ...(requestDetails.clearance ? { clearance: requestDetails.clearance } : {}),
        }; //TODO: think about applicant

        const requestNumber = (await this.requestRepo.count()) + 1;

        const newRequest: Request = Request.createNew({ ...requestProps, payload, requestNumber });

        const res = await this.requestRepo.create(newRequest, REQUEST_TYPE.CREATE);

        if (!res) throw new InternalError(`Error Creating Create Group Request: ${payload.name}`);

        return requestNumber;
    };

    public addDis = async (requestDetails: disToGroupDTO): Promise<number> => {
        // TODO: check if request already exists ?
        const existsGroup = await this.groupRepo.findById(requestDetails.groupId);

        if (!existsGroup) throw new BadRequestError(`Add dis to non exists group with id ${requestDetails.groupId}`);

        const { applicant, approvalsNeeded } = requestDetails;
        const requestProps = { type: REQUEST_TYPE.ADD_DIS, applicant, approvalsNeeded };
        const payload = { groupId: requestDetails.groupId, disUniqueId: requestDetails.disUniqueId };

        const requestNumber = (await this.requestRepo.count()) + 1;

        const newRequest: Request = Request.createNew({ ...requestProps, payload, requestNumber });

        const res = await this.requestRepo.create(newRequest, REQUEST_TYPE.ADD_DIS);

        if (!res) throw new InternalError(`Error Creating Add Dis To Group Request: ${payload.groupId} -> ${payload.disUniqueId}`);

        return requestNumber;
    };

    public removeDis = async (requestDetails: disToGroupDTO): Promise<number> => {
        const existsGroup = await this.groupRepo.findById(requestDetails.groupId);

        if (!existsGroup) throw new BadRequestError(`Remove dis to non exists group with id ${requestDetails.groupId}`);

        const { applicant, approvalsNeeded } = requestDetails;
        const requestProps = { type: REQUEST_TYPE.REMOVE_DIS, applicant, approvalsNeeded };
        const payload = { groupId: requestDetails.groupId, disUniqueId: requestDetails.disUniqueId };

        const requestNumber = (await this.requestRepo.count()) + 1;

        const newRequest: Request = Request.createNew({ ...requestProps, payload, requestNumber });

        const res = await this.requestRepo.create(newRequest, REQUEST_TYPE.REMOVE_DIS);

        if (!res) throw new InternalError(`Error Creating Remove Dis To Group Request: ${payload.groupId} -> ${payload.disUniqueId}`);

        return requestNumber;
    };

    public addEntities = async (requestDetails: entitiesDTO): Promise<number> => {
        const existsGroup = await this.groupRepo.findById(requestDetails.groupId);

        if (!existsGroup) throw new BadRequestError(`Add entities to non exists group with id ${requestDetails.groupId}`);

        const { applicant, approvalsNeeded } = requestDetails;
        const requestProps = { type: REQUEST_TYPE.ADD_ENTITIES, applicant, approvalsNeeded };
        const payload = { groupId: requestDetails.groupId, entitiesId: requestDetails.entitiesId };

        const requestNumber = (await this.requestRepo.count()) + 1;

        const newRequest: Request = Request.createNew({ ...requestProps, payload, requestNumber });

        const res = await this.requestRepo.create(newRequest, REQUEST_TYPE.ADD_ENTITIES);

        if (!res) throw new InternalError(`Error Creating Add Entities To Group Request: ${payload.groupId} -> ${payload.entitiesId}`);

        return requestNumber;
    };

    public removeEntities = async (requestDetails: entitiesDTO): Promise<number> => {
        const existsGroup = await this.groupRepo.findById(requestDetails.groupId);

        if (!existsGroup) throw new BadRequestError(`Remove entities to non exists group with id ${requestDetails.groupId}`);

        const { applicant, approvalsNeeded } = requestDetails;
        const requestProps = { type: REQUEST_TYPE.REMOVE_ENTITIES, applicant, approvalsNeeded };
        const payload = { groupId: requestDetails.groupId, entitiesId: requestDetails.entitiesId };

        const requestNumber = (await this.requestRepo.count()) + 1;

        const newRequest: Request = Request.createNew({ ...requestProps, payload, requestNumber });

        const res = await this.requestRepo.create(newRequest, REQUEST_TYPE.REMOVE_ENTITIES);

        if (!res) throw new InternalError(`Error Creating Remove Entities To Group Request: ${payload.groupId} -> ${payload.entitiesId}`);

        return requestNumber;
    }

    public rename = async (requestDetails: renameDTO): Promise<number> => {
        const existsGroup = await this.groupRepo.findOne({ name: requestDetails.name });

        if (existsGroup) throw new BadRequestError(`Group with the name ${requestDetails.name} already exists`);

        const existsRequest = await this.requestRepo.findOne({ name: requestDetails.name }, REQUEST_TYPE.RENAME);

        if (existsRequest) throw new BadRequestError(`Create request of a group with the name ${requestDetails.name} already exists`);

        const { applicant, approvalsNeeded } = requestDetails;
        const requestProps = { type: REQUEST_TYPE.RENAME, applicant, approvalsNeeded };
        const payload = { groupId: requestDetails.groupId, name: requestDetails.name };

        const requestNumber = (await this.requestRepo.count()) + 1;

        const newRequest: Request = Request.createNew({ ...requestProps, payload, requestNumber });

        const res = await this.requestRepo.create(newRequest, REQUEST_TYPE.RENAME);

        if (!res) throw new InternalError(`Error Renaming Group Request: ${payload.groupId}}`);

        return requestNumber;
    }

    public addAdmins = async (requestDetails: adminsDTO): Promise<number> => {
        const existsGroup = await this.groupRepo.findById(requestDetails.groupId);

        if (!existsGroup) throw new BadRequestError(`Add admins to non exists group with id ${requestDetails.groupId}`);

        const { applicant, approvalsNeeded } = requestDetails;
        const requestProps = { type: REQUEST_TYPE.ADD_ADMINS, applicant, approvalsNeeded };
        const payload = { groupId: requestDetails.groupId, adminsId: requestDetails.adminsId };

        const requestNumber = (await this.requestRepo.count()) + 1;

        const newRequest: Request = Request.createNew({ ...requestProps, payload, requestNumber });

        const res = await this.requestRepo.create(newRequest, REQUEST_TYPE.ADD_ADMINS);

        if (!res) throw new InternalError(`Error Creating Add Admins To Group Request: ${payload.groupId} -> ${payload.adminsId}`);

        return requestNumber;
    }

    public removeAdmins = async (requestDetails: adminsDTO): Promise<number> => {
        const existsGroup = await this.groupRepo.findById(requestDetails.groupId);

        if (!existsGroup) throw new BadRequestError(`Remove admins to non exists group with id ${requestDetails.groupId}`);

        const { applicant, approvalsNeeded } = requestDetails;
        const requestProps = { type: REQUEST_TYPE.REMOVE_ADMINS, applicant, approvalsNeeded };
        const payload = { groupId: requestDetails.groupId, adminsId: requestDetails.adminsId };

        const requestNumber = (await this.requestRepo.count()) + 1;

        const newRequest: Request = Request.createNew({ ...requestProps, payload, requestNumber });

        const res = await this.requestRepo.create(newRequest, REQUEST_TYPE.REMOVE_ADMINS);

        if (!res) throw new InternalError(`Error Creating Remove Admins From Group Request: ${payload.groupId} -> ${payload.adminsId}`);

        return requestNumber;
    }

    public changeClearance = async (requestDetails: changeClearanceDTO): Promise<number> => {
        const existsGroup = await this.groupRepo.findById(requestDetails.groupId);

        if (!existsGroup) throw new BadRequestError(`Change clearance to non exists group with id ${requestDetails.groupId}`);

        const { applicant, approvalsNeeded } = requestDetails;
        const requestProps = { type: REQUEST_TYPE.CHANGE_CLEARANCE, applicant, approvalsNeeded };
        const payload = { groupId: requestDetails.groupId, clearance: requestDetails.clearance };

        const requestNumber = (await this.requestRepo.count()) + 1;

        const newRequest: Request = Request.createNew({ ...requestProps, payload, requestNumber });

        const res = await this.requestRepo.create(newRequest, REQUEST_TYPE.CHANGE_CLEARANCE);

        if (!res) throw new InternalError(`Error Creating Change Clearance to Group Request: ${payload.groupId} -> ${payload.clearance}`);

        return requestNumber;
    }

    public approveRound = async (approveDetails: approveRoundDTO): Promise<boolean> => {
        const { requestNumber, authorityId, approved } = approveDetails;
        const request: Request | null = await this.requestRepo.findByRequestNumber(requestNumber);

        if (!request) throw new NotFoundError(`Request Not Found`);

        request.approveRound(authorityId, approved);
        request.checkAllApprovalRounds();

        const res = await this.requestRepo.save(request, request.type);

        return !!res;
    };

    // public auth = async (token: string) => {
    //     const payload: any = verify(token, config.keys.tokenKey);

    //     if (!payload || !payload.userIdEnc) return null;

    //     const userId = decrypt(payload.userIdEnc);

    //     const user = await this.getUserById(userId);

    //     if (!user) return null;

    //     return userId;
    // };
}
