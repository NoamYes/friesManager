import { RequestDoc } from './../mongo/models/request.model';
import { APPROVAL_ROUND_STATUS, REQUEST_STATUS, REQUEST_TYPE } from './../config/enums';
import { Types } from 'mongoose';
import { approvalRound } from '../types/request.type';
import { BadRequestError } from '../express/utils/error';
import { approvalNeed } from '../express/joi/validator/request.schema';

export type RequestState = {
    _id: Types.ObjectId;
    type: REQUEST_TYPE;
    status: REQUEST_STATUS;
    applicant: string;
    createdAt: Date;
    updatedAt: Date;
    approvalRounds?: approvalRound[];
    payload?: any;
};

export type newRequestProps = {
    type: REQUEST_TYPE;
    applicant: string;
    approvalsNeeded?: approvalNeed[];
    payload?: any;
};

export class Request {
    private _id?: Types.ObjectId;
    private _type: REQUEST_TYPE;
    private _status: REQUEST_STATUS;
    private _applicant: string;
    private _createdAt: Date;
    private _updatedAt: Date;
    private _approvalRounds?: approvalRound[];
    private _payload?: any;

    protected constructor(props: RequestState) {
        this._id = props._id;
        this._type = props.type;
        this._status = props.status;
        this._applicant = props.applicant;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
        this._payload = props.payload;
        this._approvalRounds = props.approvalRounds;
    }

    get id() {
        return this._id;
    }

    get type() {
        return this._type;
    }

    get status() {
        return this._status;
    }

    get applicant() {
        return this._applicant;
    }

    get createdAt() {
        return this._createdAt;
    }

    get updatedAt() {
        return this._updatedAt;
    }

    get approvalRounds() {
        return this._approvalRounds;
    }

    get payload() {
        return this._payload;
    }

    public approveRound(authorityId: string, approved: boolean): void {
        if (!this.approvalRounds) throw new BadRequestError(`Request has no approval rounds`);

        const approvalRoundIndex = this.approvalRounds.findIndex((round) => round.permissionResponsibility.authorityId === authorityId);
        if (approvalRoundIndex < 0) throw new BadRequestError(`Not expecting approval from this authority`);

        this._approvalRounds![approvalRoundIndex].status = approved ? APPROVAL_ROUND_STATUS.APPROVED : APPROVAL_ROUND_STATUS.DENIED;
    }

    public checkAllApproved(): void {
        if (!this.approvalRounds?.some(round => round.status !== APPROVAL_ROUND_STATUS.APPROVED))
            this._status = REQUEST_STATUS.IN_PROCESS;
    }

    static initApprovalRounds(approvalsNeeded: approvalNeed[]): approvalRound[] {
        return approvalsNeeded.map((approvalNeeded: approvalNeed): approvalRound => {
            return {
                permissionResponsibility: {
                    type: approvalNeeded.approvalType,
                    authorityId: approvalNeeded.authorityId,
                },
                status: APPROVAL_ROUND_STATUS.AWAITING
            }
        })
    }

    static _create(state: RequestState): Request {
        return new Request(state);
    }

    static _createNew(props: newRequestProps): Request {
        const createdAt = new Date();
        const updatedAt = createdAt;
        const _id = new Types.ObjectId();
        const status = props.approvalsNeeded ? REQUEST_STATUS.WAITING_FOR_APPROVALS : REQUEST_STATUS.IN_PROCESS;
        let approvalRounds: approvalRound[] | null = null; // TODO: should be null sometime

        if (props.approvalsNeeded)
            approvalRounds = Request.initApprovalRounds(props.approvalsNeeded!);
        delete props.approvalsNeeded;

        return new Request({ ...props, createdAt, updatedAt, _id, status, ...(approvalRounds ? { approvalRounds } : {}) });
    }

    static toPersistance(request: Request): RequestDoc {
        return {
            _id: new Types.ObjectId(request._id),
            type: request.type,
            applicant: request.applicant,
            createdAt: request.createdAt,
            updatedAt: request.updatedAt,
            approvalRounds: request.approvalRounds,
            status: request.status,
            ...request.payload,
        };
    }

    static toDomain(raw: RequestDoc): Request {
        let createdRequest: Request;
        const { _id, ...requestState } = raw;
        const { type, applicant, createdAt, updatedAt, status, approvalRounds, ...payload } = requestState;
        createdRequest = Request._create({ _id, ...requestState, payload });
        return createdRequest;
    }
}
