import { RequestDoc } from './../mongo/models/request.model';
import { REQUEST_TYPE } from './../config/enums';
import { Types } from 'mongoose';
import { ApprovalRound } from '../types/request.type';

export type RequestState = {
    _id?: Types.ObjectId;
    type: REQUEST_TYPE;
    applicant: string;
    createdAt: Date;
    updatedAt: Date;
    approvalRounds?: ApprovalRound[];
    payload?: any;
};

export class Request {
    private _id?: Types.ObjectId;
    private _type: REQUEST_TYPE;
    private _applicant: string;
    private _createdAt: Date;
    private _updatedAt: Date;
    private _approvalRounds?: ApprovalRound[];
    private _payload?: any;

    protected constructor(props: RequestState) {
        this._id = props._id;
        this._type = props.type;
        this._applicant = props.applicant;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
        this._approvalRounds = props.approvalRounds;
        this._payload = props.payload;
    }
    get id() {
        return this._id;
    }
    get type() {
        return this._type;
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

    static _create(state: RequestState): Request {
        return new Request(state);
    }

    static _createNew(state: Omit<RequestState, 'createdAt' | 'updatedAt' | '_id'>): Request {
        const createdAt = new Date();
        const updatedAt = createdAt;
        const _id = new Types.ObjectId();
        return new Request({ ...state, createdAt, updatedAt, _id });
    }

    static toPersistance(request: Request): RequestDoc {
        return {
            _id: new Types.ObjectId(request._id),
            type: request.type,
            applicant: request.applicant,
            createdAt: request.createdAt,
            updatedAt: request.updatedAt,
            approvalRounds: request.approvalRounds,
            ...request.payload,
        };
    }

    static toDomain(raw: RequestDoc): Request {
        let createdRequest: Request;
        const { _id, ...requestState } = raw;
        const { type, applicant, createdAt, updatedAt, approvalRounds, ...payload } = requestState;
        createdRequest = Request._create({ _id, ...requestState, payload });
        return createdRequest;
    }
}
