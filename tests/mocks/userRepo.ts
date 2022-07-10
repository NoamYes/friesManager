import User from '../../src/types/user.type';
import { IUserRepo } from './../../src/interfaces/userRepo.interface';

class UserRepoMock implements IUserRepo {
    private users: User[] = [
        {
            _id: '1',
            name: 'test user',
            password: 'qiYCgeA3lHqOGYsQVCkmZA==',
        },
    ];
    public getUserById = async (userId: string): Promise<User | null> => {
        const user = this.users.find((u) => u._id === userId);
        return user ? ({ _id: user._id, name: user.name } as User) : null;
    };

    public getUserByNameAndPassword = async (name: string, password: string): Promise<User | null> => {
        const user = this.users.find((u) => u.name === name && u.password === password);
        return user ? ({ _id: user._id, name: user.name } as User) : null;
    };

    public createUser = async (user: User) => {
        this.users.push(user);
        return user;
    };

    public updateUser = async (userId: string, name: string) => {
        const user: User | undefined = this.users.find((u) => u._id === userId);
        if (user) {
            user.name = name;
            return { _id: user._id, name: user.name } as User;
        }
        return null;
    };

    public deleteUser = async (userId: string) => {
        const user = this.users.find((u) => u._id === userId);
        if (user) {
            this.users = this.users.filter((u) => u._id !== userId);
            return { _id: user._id, name: user.name } as User;
        }
        return null;
    };

    public getUser = async (userId: string) => {
        const user = this.users.find((u) => u._id === userId);
        return user ? ({ _id: user._id, name: user.name } as User) : null;
    };

    public getAllUsers = async () => {
        return this.users.map((user) => ({ _id: user._id, name: user.name } as User));
    };
}

export default UserRepoMock;
