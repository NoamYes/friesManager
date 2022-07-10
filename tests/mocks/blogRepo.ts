import { IBlogRepo } from '../../src/interfaces/blogRepo.interface';
import Blog from '../../src/types/blog.type';

class BlogRepoMock implements IBlogRepo {
    private blogs: Blog[] = [
        {
            _id: '1',
            title: 'test blog',
            description: 'test blog description',
            author: 'test author',
        },
    ];

    public createBlog = async (blog: Blog) => {
        this.blogs.push(blog);
        return blog;
    };

    public updateBlog = async (blogId: string, description: string) => {
        const blog = this.blogs.find((b) => b._id === blogId);
        if (blog) {
            blog.description = description;
            return blog;
        }
        return null;
    };

    public deleteBlog = async (blogId: string) => {
        const blog = this.blogs.find((b) => b._id === blogId);
        if (blog) {
            this.blogs = this.blogs.filter((b) => b._id !== blogId);
            return blog;
        }
        return null;
    };

    public getBlog = async (blogId: string) => {
        const blog = this.blogs.find((b) => b._id === blogId);

        return blog || null;
    };

    public getAllBlogs = async () => {
        return this.blogs;
    };

    public getBlogsByAuthor = async (userName: string) => {
        const blogs = this.blogs.filter((b) => b.author === userName);

        return blogs || null;
    };
}

export default BlogRepoMock;
