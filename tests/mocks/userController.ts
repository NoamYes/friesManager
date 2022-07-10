import { generateToken } from './../../src/auth/token';
import { Request, Response } from 'express';
import { IUserController } from './../../src/interfaces/userController.interface';
import User from '../../src/types/user.type';
import { encrypt } from '../../src/utils/encrypt';

class UserControllerMock implements IUserController {
    private users: User[] = [
        {
            _id: '1',
            name: 'test user',
            password: 'qiYCgeA3lHqOGYsQVCkmZA==',
        },
        {
            _id: 'to delete',
            name: 'test user for delete test',
            password: 'qiYCgeA3lHqOGYsQVCkmZA==',
        },
    ];

    public login = async (req: Request, res: Response): Promise<void> => {
        const user = this.users.find((u) => u.name === req.body.name && u.password === encrypt(req.body.password));
        if (user) {
            res.json({ user, token: generateToken('token') });
        } else {
            res.status(404).send({ message: 'fail to login' });
        }
    };

    public createUser = async (req: Request, res: Response): Promise<void> => {
        const user = req.body;
        this.users.push(user);
        res.json(user);
    };

    public updateUser = async (req: Request, res: Response): Promise<void> => {
        const user = this.users.find((u) => u._id === req.params.userId);
        if (user) {
            user.name = req.body.name;
            res.json(user);
        } else {
            res.status(404).send({ message: 'fail to update user' });
        }
    };

    public deleteUser = async (req: Request, res: Response): Promise<void> => {
        const user = this.users.find((u) => u._id === req.params.userId);
        if (user) {
            this.users = this.users.filter((u) => u._id !== req.params.userId);
            res.json(user);
        } else {
            res.status(404).send({ message: 'fail to delete user' });
        }
    };

    public getUser = async (req: Request, res: Response): Promise<void> => {
        const user = this.users.find((u) => u._id === req.params.userId);
        if (user) {
            res.json({ _id: user._id, name: user.name });
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    };

    public getAllUsers = async (_req: Request, res: Response): Promise<void> => {
        res.json(this.users.map((user) => ({ _id: user._id, name: user.name })));
    };

    public getUserById = async (req: Request, res: Response): Promise<void> => {
        const user = this.users.find((u) => u._id === req.params.userId);
        if (user) {
            res.json({ _id: user._id, name: user.name });
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    };

    public getUserByNameAndPassword = async (req: Request, res: Response): Promise<void> => {
        const user = this.users.find((u) => u.name === req.body.name && u.password === req.body.password);
        if (user) {
            res.json({ _id: user._id, name: user.name });
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    };
}

export default UserControllerMock;
