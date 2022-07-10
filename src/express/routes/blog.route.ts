import * as express from 'express';
import { wrapController } from '../utils/wraps';
import validateRequest from '../joi/joi';
import { updateSchema, createSchema } from '../joi/validator/blog.schema';
import { IBlogController } from '../../interfaces/blogController.interface';

class BlogRouter {
    public path: string = '/blogs';
    public router = express.Router();
    private blogController: IBlogController;
    private auth: express.RequestHandler;

    constructor(blogController: IBlogController, auth: express.RequestHandler) {
        this.blogController = blogController;
        this.auth = auth;
        this.initializeRoutes();
    }

    public getRouter() {
        return this.router;
    }

    public initializeRoutes() {
        this.router.use(this.auth);
        this.router.get('', wrapController(this.blogController.getAllBlogs));
        this.router.get('/:blogId', wrapController(this.blogController.getBlog));
        this.router.post('', validateRequest(createSchema), wrapController(this.blogController.createBlog));
        this.router.put('/:blogId', validateRequest(updateSchema), wrapController(this.blogController.updateBlog));
        this.router.delete('/:blogId', wrapController(this.blogController.deleteBlog));
        this.router.get('/author/:userName', wrapController(this.blogController.getBlogsByAuthor));
    }
}

export default BlogRouter;
