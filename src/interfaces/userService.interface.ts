import User from '../types/user.type';

export interface IUserService {
    createUser(user: User): Promise<User>;
    updateUser(userId: string, name: string): Promise<User | null>;
    deleteUser(userId: string): Promise<User | null>;
    getUserById(userId: string): Promise<User | null>;
    getAllUsers(): Promise<User[] | null>;
    getUserByNameAndPassword(name: string, password: string): Promise<User | null>;
    login(name: string, password: string): Promise<{ user: User; token: string } | null>;
    auth(token: string): Promise<string | null>;
}
