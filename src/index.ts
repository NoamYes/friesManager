import { UserRepo } from './mongo/repo/user.repo';
import initializeMongo from './mongo/initializeMongo';
import App from './express/app';
import config from './config/config';
import UserRouter from './express/routes/user.route';
import { userModel } from './mongo/models/user.model';
import { UserService } from './express/services/user.service';
import { UserController } from './express/controllers/user.controller';
import { BlogController } from './express/controllers/blog.controller';
import BlogRouter from './express/routes/blog.route';
import { BlogService } from './express/services/blog.service';
import blogModel from './mongo/models/blog.model';
import { BlogRepo } from './mongo/repo/blog.repo';
import Auth from './express/services/auth.service';

const { mongo } = config;

/**
 * The main function.
 * Calls all the initialization functions.
 */
const main = async () => {
    await initializeMongo(mongo.uri);

    const userRepo = new UserRepo(userModel);
    const blogRepo = new BlogRepo(blogModel);

    const userService = new UserService(userRepo);
    const blogService = new BlogService(blogRepo);

    const userController = new UserController(userService);
    const blogController = new BlogController(blogService);

    const auth = new Auth(userService.auth);

    const userRouter = new UserRouter(userController, auth.check);
    const blogRouter = new BlogRouter(blogController, auth.check);

    const port = config.server.port || 2770;
    new App(port, [userRouter, blogRouter]);
};

main().catch((err) => {
    console.log(err);
    process.exit();
});
