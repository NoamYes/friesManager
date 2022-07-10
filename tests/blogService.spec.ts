import { IBlogService } from '../src/interfaces/blogService.interface';
import Blog from '../src/types/blog.type';
import { BlogService } from '../src/express/services/blog.service';
import BlogRepoMock from './mocks/blogRepo';

let blogService: IBlogService;

jest.setTimeout(60000);

describe('blog service', () => {
    beforeAll(async () => {
        blogService = new BlogService(new BlogRepoMock());
    });

    test('create blog', async () => {
        const newBlog: Blog = {
            _id: '2',
            title: 'test',
            description: 'description',
            author: 'test author',
        };
        const createdBlog = await blogService.createBlog(newBlog);
        expect(createdBlog?.title).toEqual(newBlog.title);
        expect(createdBlog?.description).toEqual(newBlog.description);
    });

    test('update blog', async () => {
        const blogId = '1';
        const description = 'test update';
        const blog = await blogService.updateBlog(blogId, description);
        expect(blog?.description).toEqual('test update');
    });

    test('delete blog', async () => {
        const blogId = '2';
        await blogService.deleteBlog(blogId);
        const blog = await blogService.getBlog(blogId);
        expect(blog).toEqual(null);
    });

    test('get blog', async () => {
        const blogId = '1';
        const blog = await blogService.getBlog(blogId);
        expect(blog).toBeDefined();
    });
    test('fail to get blog', async () => {
        const blogId = '4';
        const blog = await blogService.getBlog(blogId);
        expect(blog).toBeFalsy();
    });

    test('get all blogs', async () => {
        const blogs = await blogService.getAllBlogs();
        expect(blogs).toBeDefined();
    });

    test('get blogs by author', async () => {
        const userName = 'test author';
        const blogs = await blogService.getBlogsByAuthor(userName);
        expect(blogs).toBeDefined();
    });
});
