import { IBlogService } from './../../interfaces/blogService.interface';
import { Request, Response } from 'express';
import Blog from '../../types/blog.type';
import { IBlogController } from '../../interfaces/blogController.interface';
import { logInfo } from '../../log/logger';
export class BlogController implements IBlogController {
    private blogService: IBlogService;

    constructor(blogService: IBlogService) {
        logInfo('BlogController created');
        this.blogService = blogService;
    }

    public createBlog = async (req: Request, res: Response) => {
        const newBlog = req.body;
        const blog: Blog = await this.blogService.createBlog(newBlog);
        if (!blog) res.status(404).send({ error: 'fail to create blog' });
        else res.send(blog);
    };

    public updateBlog = async (req: Request, res: Response) => {
        const blogId = req.params.blogId;
        const description = req.body.description;
        const blog: Blog | null = await this.blogService.updateBlog(blogId, description);
        if (!blog) res.status(404).send({ error: 'fail to update blog' });
        else res.send(blog);
    };

    public deleteBlog = async (req: Request, res: Response) => {
        const blogId = req.params.blogId;
        const blog: Blog | null = await this.blogService.deleteBlog(blogId);
        if (!blog) res.status(404).send({ error: 'fail to delete blog' });
        else res.send({ msg: 'Blog deleted successfully', blog });
    };

    public getBlog = async (req: Request, res: Response) => {
        const blogId = req.params.blogId;
        const blog: Blog | null = await this.blogService.getBlog(blogId);
        if (!blog) res.status(404).send('blog not found');
        else res.send(blog);
    };

    public getAllBlogs = async (_req: Request, res: Response) => {
        const blogs: Blog[] | null = await this.blogService.getAllBlogs();
        if (!blogs) res.status(404).send({ error: 'fail to get all blogs' });
        else res.send(blogs);
    };

    public getBlogsByAuthor = async (req: Request, res: Response) => {
        const userName = req.params.userName;
        const blogs: Blog[] | null = await this.blogService.getBlogsByAuthor(userName);
        if (!blogs) res.status(404).send({ error: 'fail to get blogs by author' });
        else res.send(blogs);
    };
}
