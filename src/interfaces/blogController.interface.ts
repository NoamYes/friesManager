import { Response, Request } from 'express';

export interface IBlogController {
    createBlog(req: Request, res: Response): Promise<void>;
    updateBlog(req: Request, res: Response): Promise<void>;
    deleteBlog(req: Request, res: Response): Promise<void>;
    getBlog(req: Request, res: Response): Promise<void>;
    getAllBlogs(req: Request, res: Response): Promise<void>;
    getBlogsByAuthor(req: Request, res: Response): Promise<void>;
}
