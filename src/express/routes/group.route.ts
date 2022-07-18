import * as express from 'express';
import { wrapController } from '../utils/wraps';
import validateRequest from '../joi/joi';
import IRouter from '../../interfaces/router.interface';
import { IGroupController } from '../../interfaces/groups/controller.interface';
import { getByAdminIdSchema, getByIdSchema, getByNameSchema } from '../joi/validator/group.schema';

export default class implements IRouter {
    public path: string = '/groups';
    public router = express.Router();
    private controller: IGroupController;
    // private auth?: express.RequestHandler;

    constructor(groupController: IGroupController, _auth?: express.RequestHandler) {
        this.controller = groupController;
        // this.auth = auth;
        this.initializeRoutes();
    }

    public getRouter() {
        return this.router;
    }

    public initializeRoutes() {
        this.router.get('/:id', validateRequest(getByIdSchema), wrapController(this.controller.getById));
        this.router.get('/name/:name', validateRequest(getByNameSchema), wrapController(this.controller.getByName));
        this.router.get('/admin/:id', validateRequest(getByAdminIdSchema), wrapController(this.controller.getByAdminId));
    }
}
