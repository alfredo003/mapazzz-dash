import { RequestHandler, Router } from "express";
import { UserController } from "../controllers/UserController";


const userRouter = Router();

userRouter.post('/',UserController.create as RequestHandler);
userRouter.get('/',UserController.getAll as RequestHandler);
userRouter.get('/:uid',UserController.getById);
userRouter.patch('/:uid/block',UserController.blockUser);
userRouter.put('/:uid',UserController.update as RequestHandler);
userRouter.post('/newpass',UserController.updatePassword as RequestHandler);

export default userRouter;