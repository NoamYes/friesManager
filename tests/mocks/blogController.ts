import { Request, Response } from 'express';
import { IBlogController } from './../../src/interfaces/blogController.interface';
import Blog from '../../src/types/blog.type';

class BlogControllerMock implements IBlogController {
    private blogs: Blog[] = [
        {
            _id: '1',
            title: 'test blog',
            description: 'test blog content',
            author: 'test author',
        },
        {
            _id: 'todelete',
            title: 'test blog',
            description: 'test blog content',
            author: 'test author2',
        },
    ];

    public getAllBlogs = async (_req: Request, res: Response): Promise<void> => {
        res.json(this.blogs);
    };

    public getBlog = async (req: Request, res: Response): Promise<void> => {
        const blog = this.blogs.find((b) => b._id === req.params.blogId);
        if (blog) {
            res.json(blog);
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    };

    public createBlog = async (req: Request, res: Response): Promise<void> => {
        const blog = req.body;
        this.blogs.push(blog);
        res.json(blog);
    };

    public updateBlog = async (req: Request, res: Response): Promise<void> => {
        const blog = this.blogs.find((b) => b._id === req.params.blogId);
        if (blog) {
            blog.description = req.body.description;
            res.json(blog);
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    };

    public deleteBlog = async (req: Request, res: Response): Promise<void> => {
        const blog = this.blogs.find((b) => b._id === req.params.blogId);
        if (blog) {
            this.blogs = this.blogs.filter((b) => b._id !== req.params.blogId);
            res.json(blog);
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    };

    public getBlogsByAuthor = async (req: Request, res: Response): Promise<void> => {
        const blogs = this.blogs.filter((b) => b.author === req.params.userName);
        res.json(blogs);
    };
}

export default BlogControllerMock;
