import { executedRequestSchema } from '../joi/validator/executedRequests';
import * as express from 'express';
import { wrapController } from '../utils/wraps';
import validateRequest from '../joi/joi';
import { IExecutedRequestsController } from '../../interfaces/executedRequestController.interface';

// TODO: should be handling events in api? /events path? or raising events?
export default class {
    public path: string = '/executedRequest';
    public router = express.Router();
    private controller: IExecutedRequestsController;
    // private auth?: express.RequestHandler;

    constructor(executedRequestController: IExecutedRequestsController, _auth?: express.RequestHandler) {
        this.controller = executedRequestController;
        // this.auth = auth;
        this.initializeRoutes();
    }

    public getRouter() {
        return this.router;
    }

    public initializeRoutes() {
        this.router.post('/executed/:requestNumber', validateRequest(executedRequestSchema), wrapController(this.controller.executedRequest));
    }
}
