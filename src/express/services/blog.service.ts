import Blog from '../../types/blog.type';
import { IBlogRepo } from '../../interfaces/blogRepo.interface';
import { IBlogService } from '../../interfaces/blogService.interface';
import { logInfo } from '../../log/logger';

export class BlogService implements IBlogService {
    private BlogRepo: IBlogRepo;
    constructor(blogRepo: IBlogRepo) {
        logInfo('BlogService created');
        this.BlogRepo = blogRepo;
    }

    public createBlog = async (blog: Blog) => {
        const newBlog = await this.BlogRepo.createBlog(blog);
        return newBlog;
    };

    public updateBlog = async (blogId: string, description: string) => {
        const blog = await this.BlogRepo.updateBlog(blogId, description);
        return blog;
    };

    public deleteBlog = async (blogId: string) => {
        const blog = await this.BlogRepo.deleteBlog(blogId);
        return blog;
    };

    public getBlog = async (blogId: string) => {
        const blog = await this.BlogRepo.getBlog(blogId);
        return blog;
    };

    public getAllBlogs = async () => {
        const blogs = await this.BlogRepo.getAllBlogs();
        return blogs;
    };

    public getBlogsByAuthor = async (userName: string) => {
        const blogs = await this.BlogRepo.getBlogsByAuthor(userName);
        return blogs;
    };
}
