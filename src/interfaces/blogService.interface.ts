import Blog from '../types/blog.type';

export interface IBlogService {
    createBlog(blog: Blog): Promise<Blog>;
    updateBlog(blogId: string, description: string): Promise<Blog | null>;
    deleteBlog(blogId: string): Promise<Blog | null>;
    getBlog(blogId: string): Promise<Blog | null>;
    getAllBlogs(): Promise<Blog[] | null>;
    getBlogsByAuthor(userName: string): Promise<Blog[] | null>;
}
