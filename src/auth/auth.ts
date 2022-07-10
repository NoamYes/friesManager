// import { verify } from 'jsonwebtoken';

// import { NextFunction, Request, Response } from 'express';
// import config from '../config/config';
// import { decrypt } from '../utils/encrypt';

// const errorRes = (res: Response) => res.status(401).send({ error: 'unauthorized', status: 401 });

// type payloadType = {
//     userIdEnc: string;
// };

// const isAuth = async (req: Request, res: Response, next: NextFunction) => {
//     if (!config.server.needAuth) return next();

//     const token = req.header('Authorization');

//     try {
//         if (!token) return errorRes(res);

//         const payload: payloadType = verify(token, config.keys.tokenKey) as payloadType;

//         if (!payload || !payload.userIdEnc) return errorRes(res);

//         const userId = decrypt(payload.userIdEnc);

//         const user = await UserS.getUserById(userId);

//         if (!user) return errorRes(res);

//         req['user'] = user;

//         return next();
//     } catch (err) {
//         return errorRes(res);
//     }
// };

// export default isAuth;
