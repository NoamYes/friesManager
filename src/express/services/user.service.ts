import { generateToken } from '../../auth/token';
import { IUserRepo } from '../../interfaces/userRepo.interface';
import { IUserService } from '../../interfaces/userService.interface';
import { logInfo } from '../../log/logger';
import User from '../../types/user.type';
import { decrypt, encrypt } from '../../utils/encrypt';
import { verify } from 'jsonwebtoken';
import config from '../../config/config';

export class UserService implements IUserService {
    private UserRepo: IUserRepo;

    constructor(userRepo: IUserRepo) {
        logInfo('UserService created');
        this.UserRepo = userRepo;
    }

    public auth = async (token: string) => {
        const payload: any = verify(token, config.keys.tokenKey);

        if (!payload || !payload.userIdEnc) return null;

        const userId = decrypt(payload.userIdEnc);

        const user = await this.getUserById(userId);

        if (!user) return null;

        return userId;
    };

    public createUser = async (user: User) => {
        const newUser = await this.UserRepo.createUser({
            name: user.name,
            password: encrypt(user.password!),
        });

        return newUser;
    };

    public updateUser = async (userId: string, name: string) => {
        const user = await this.UserRepo.updateUser(userId, name);
        return user;
    };

    public deleteUser = async (userId: string) => {
        const user = await this.UserRepo.deleteUser(userId);
        return user;
    };

    public getUserById = async (userId: string) => {
        const user = await this.UserRepo.getUserById(userId);
        return user;
    };

    public getAllUsers = async () => {
        const users = await this.UserRepo.getAllUsers();
        return users;
    };

    public getUserByNameAndPassword = async (name: string, password: string) => {
        const user = await this.UserRepo.getUserByNameAndPassword(name, encrypt(password));
        return user;
    };

    public login = async (name: string, password: string) => {
        const user = await this.getUserByNameAndPassword(name, password);

        if (!user) return null;

        const token = generateToken(user._id!.toString());
        return { user, token };
    };
}
