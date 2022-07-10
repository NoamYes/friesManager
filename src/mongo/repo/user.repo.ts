import mongoose from 'mongoose';
import User from '../../types/user.type';
import { IUserRepo } from '../../interfaces/userRepo.interface';
import { logInfo } from '../../log/logger';

export class UserRepo implements IUserRepo {
    private UserModel: mongoose.Model<User>;

    constructor(userModel: mongoose.Model<User>) {
        logInfo('UserRepo created');
        this.UserModel = userModel;
    }

    public getUserById = async (userId: string): Promise<User | null> => {
        const user = await this.UserModel.findById(userId, { password: 0 });
        return user;
    };

    public createUser = async (user: User): Promise<User> => {
        const newUser = await this.UserModel.create(user);
        return newUser;
    };

    public updateUser = async (userId: string, name: string): Promise<User | null> => {
        const user = await this.UserModel.findByIdAndUpdate(userId, { name }, { new: true });
        return user;
    };

    public deleteUser = async (userId: string): Promise<User | null> => {
        const user = await this.UserModel.findByIdAndDelete(userId);
        return user;
    };

    public getUser = async (userId: string): Promise<User | null> => {
        const user = await this.UserModel.findById(userId, { password: 0 });
        return user;
    };

    public getAllUsers = async (): Promise<User[] | null> => {
        const users = await this.UserModel.find({}, { password: 0 });
        return users;
    };

    public getUserByNameAndPassword = async (name: string, password: string): Promise<User | null> => {
        const user = await this.UserModel.findOne({ name, password }, { password: 0 });
        return user;
    };
}
