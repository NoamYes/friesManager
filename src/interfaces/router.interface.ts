import { Router } from 'express';

interface IRouter {
    path: string;
    router: Router;
    initializeRoutes(): void;
}

export default IRouter;
