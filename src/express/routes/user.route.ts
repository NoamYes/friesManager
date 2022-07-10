import { IUserController } from './../../interfaces/userController.interface';
import * as express from 'express';
import { wrapController } from '../utils/wraps';
import { updateSchema, createSchema } from '../joi/validator/user.schema';
import validateRequest from '../joi/joi';
class UserRouter {
    public path: string = '/users';
    public router = express.Router();
    private userController: IUserController;
    private auth: express.RequestHandler;

    constructor(userController: IUserController, auth: express.RequestHandler) {
        this.userController = userController;
        this.auth = auth;
        this.initializeRoutes();
    }

    public getRouter() {
        return this.router;
    }

    public initializeRoutes() {
        this.router.post('/login', wrapController(this.userController.login));
        this.router.post('', validateRequest(createSchema), wrapController(this.userController.createUser));
        this.router.use(this.auth);
        this.router.get('', wrapController(this.userController.getAllUsers));
        this.router.get('/:userId', wrapController(this.userController.getUserById));
        this.router.put('/:userId', validateRequest(updateSchema), wrapController(this.userController.updateUser));
        this.router.delete('/:userId', wrapController(this.userController.deleteUser));
    }
}

export default UserRouter;
