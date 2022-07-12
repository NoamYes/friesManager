import { IUserService } from '../src/interfaces/userService.interface';
import User from '../src/types/user.type';
import { UserService } from '../src/express/services/user.service';
import UserRepoMock from './mocks/userRepo';

let userService: IUserService;

jest.setTimeout(60000);

describe('UserService', () => {
    beforeAll(async () => {
        userService = new UserService(new UserRepoMock());
    });

    test('create user', async () => {
        const newUser: User = {
            _id: '2',
            name: 'test',
            password: 'test',
        };
        const user = await userService.createUser(newUser);
        expect(user.name).toEqual(newUser.name);
        expect(user.password).not.toEqual(newUser.password);
    });

    test('update user', async () => {
        const userId = '1';
        const name = 'test update';
        const user = await userService.updateUser(userId, name);
        expect(user!.name).toEqual('test update');
    });

    test('delete user', async () => {
        const userId = '2';
        await userService.deleteUser(userId);
        const user = await userService.getUserById(userId);
        expect(user).toEqual(null);
    });

    test('get user', async () => {
        const userId = '1';
        const user = await userService.getUserById(userId);
        expect(user).toBeDefined();
    });

    test('get all users', async () => {
        const users = await userService.getAllUsers();
        expect(users).toBeDefined();
    });

    test('get user by name and password', async () => {
        const name = 'test user';
        const password = 'test';
        const user = await userService.getUserByNameAndPassword(name, password);
        expect(user).toBeDefined();
    });

    test('login', async () => {
        const name = 'test user';
        const password = 'test';
        const user = await userService.login(name, password);
        expect(user).toBeDefined();
    });

    test('fail to login', async () => {
        const name = 'test not user';
        const password = 'test';
        const user = await userService.login(name, password);
        expect(user).toBeDefined();
    });
});
