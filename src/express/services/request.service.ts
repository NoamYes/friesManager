import { IRequestRepo } from './../../interfaces/requestRepo.interface';
import { createGroupDTO } from './../joi/validator/request.schema';
import { IRequestService } from '../../interfaces/requestService.interface';
import { generateToken } from '../../auth/token';
import { IUserRepo } from '../../interfaces/userRepo.interface';
import { logInfo } from '../../log/logger';
import { decrypt, encrypt } from '../../utils/encrypt';
import { verify } from 'jsonwebtoken';
import config from '../../config/config';
import findOneByQuery from '../../mongo/util/findOneByQuery';
import { CreateRequestModel } from '../../mongo/models/request.model';

export class RequestSerivce implements IRequestService {
    private repo: IRequestRepo;

    constructor(requestRepo: IRequestRepo) {
        logInfo('UserService created');
        this.repo = requestRepo;
    }

    // public auth = async (token: string) => {
    //     const payload: any = verify(token, config.keys.tokenKey);

    //     if (!payload || !payload.userIdEnc) return null;

    //     const userId = decrypt(payload.userIdEnc);

    //     const user = await this.getUserById(userId);

    //     if (!user) return null;

    //     return userId;
    // };

    public createGroup = async (createGroupRequest: createGroupDTO) => {
        const existedCreate = await findOneByQuery(CreateRequestModel, { name: createGroupRequest.name });

        this.repo.save(model, query, { ...existedCreate, create });
    };

    public addDisToGroup = async () => {};
}
