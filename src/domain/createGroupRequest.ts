import { GROUP_TYPE } from './../config/enums';
import { RequestDoc } from '../mongo/models/request.model';
import { Types } from 'mongoose';
import { Request, RequestState } from './request';

type CreateGroupRequestState = RequestState & {
    name: string;
    types: GROUP_TYPE[];
};

export class CreateGroupRequest extends Request {
    private constructor(props: CreateGroupRequestState) {
        const { name, types, ...base } = props;
        super(base);
    }

    static _create(state: RequestState): Request {
        // validate hierarchy & ancestors
        return new Request(state);
    }

    static toPersistance(request: Request): RequestDoc {
        return {
            _id: new Types.ObjectId(request.id),
            type: request.type,
            applicant: request.applicant,
            createdAt: request.createdAt,
            updatedAt: request.updatedAt,
        };
    }

    static toDomain(raw: RequestDoc): Request {
        let createdRequest: Request;
        const { _id, ...requestState } = raw;
        createdRequest = Request._create({ _id, ...requestState });
        return createdRequest;
    }
}
