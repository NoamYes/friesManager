type Blog = {
    _id?: string | object; // objectId
    title: string;
    description: string;
    author: string | object; // objectId
    createdAt?: Date;
    updatedAt?: Date;
};

export default Blog;
