import User from '../types/user.type';

export interface IUserRepo {
    getUserById(userId: string): Promise<User | null>;
    getUserByNameAndPassword(name: string, arg1: string): Promise<User | null>;
    createUser(user: User): Promise<User>;
    updateUser(userId: string, name: string): Promise<User | null>;
    deleteUser(userId: string): Promise<User | null>;
    getUser(userId: string): Promise<User | null>;
    getAllUsers(): Promise<User[] | null>;
}
