import * as express from 'express';
import { wrapController } from '../utils/wraps';
import { approveRequestSchema, createGroupRequestSchema } from '../joi/validator/request.schema';
import validateRequest from '../joi/joi';
import { IRequestController } from '../../interfaces/requestController.interface';

export default class {
    public path: string = '/requests';
    public router = express.Router();
    private controller: IRequestController;
    // private auth?: express.RequestHandler;

    constructor(requestController: IRequestController, _auth?: express.RequestHandler) {
        this.controller = requestController;
        // this.auth = auth;
        this.initializeRoutes();
    }

    public getRouter() {
        return this.router;
    }

    public initializeRoutes() {
        this.router.post('/createGroup', validateRequest(createGroupRequestSchema), wrapController(this.controller.createCreateGroup))
        this.router.put('/approve/:requestId', validateRequest(approveRequestSchema), wrapController(this.controller.approveRound))
        // this.router.patch('/createGroup', validate)
        // this.router.post('/login', wrapController(this.userController.login));
        // this.router.post('', validateRequest(createSchema), wrapController(this.userController.createUser));
        // this.router.use(this.auth);
        // this.router.get('', wrapController(this.userController.getAllUsers));
        // this.router.get('/:userId', wrapController(this.userController.getUserById));
        // this.router.put('/:userId', validateRequest(updateSchema), wrapController(this.userController.updateUser));
        // this.router.delete('/:userId', wrapController(this.userController.deleteUser));
    }
}
