import { REQUEST_TYPE } from './../../config/enums';
import { createGroupRequestSchema, AddDisToGroupSchema } from './../joi/validator/request.schema';
import * as express from 'express';
import { wrapController } from '../utils/wraps';
import { approveRequestSchema } from '../joi/validator/request.schema';
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
        this.router.post('/createGroup', validateRequest(createGroupRequestSchema),
            wrapController(this.controller.createRequest, { type: REQUEST_TYPE.CREATE_GROUP }))
        this.router.post('/addDisToGroup', validateRequest(AddDisToGroupSchema),
            wrapController(this.controller.createRequest, { type: REQUEST_TYPE.ADD_DIS_GROUP }))
        this.router.post('/removeDisFromGroup', validateRequest(AddDisToGroupSchema),
            wrapController(this.controller.createRequest, { type: REQUEST_TYPE.REMOVE_DIS_GROUP }))

        this.router.put('/approve/:requestId', validateRequest(approveRequestSchema), wrapController(this.controller.approveRound))

        // this.router.post('', wrapController(this.controller.createRequest))
    }
}
