import { REQUEST_TYPE } from './../../config/enums';
import { createGroupRequestSchema, AddDisToGroupSchema, addEntitySchema } from './../joi/validator/request.schema';
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
        this.router.post(
            '/create',
            validateRequest(createGroupRequestSchema),
            wrapController(this.controller.createRequest, { type: REQUEST_TYPE.CREATE }),
        );
        this.router.post(
            '/addDis',
            validateRequest(AddDisToGroupSchema),
            wrapController(this.controller.createRequest, { type: REQUEST_TYPE.ADD_DIS }),
        );
        this.router.post(
            '/remove',
            validateRequest(AddDisToGroupSchema),
            wrapController(this.controller.createRequest, { type: REQUEST_TYPE.REMOVE_DIS }),
        );
        this.router.post(
            '/addEntity',
            validateRequest(addEntitySchema),
            wrapController(this.controller.createRequest, { type: REQUEST_TYPE.ADD_ENTITIES })
        )

        this.router.put('/approve/:requestNumber', validateRequest(approveRequestSchema), wrapController(this.controller.approveRound));

        // this.router.post('', wrapController(this.controller.createRequest))
    }
}
