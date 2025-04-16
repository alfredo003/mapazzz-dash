import { RequestHandler, Router } from "express";
import { UserController } from "../controllers/UserController";


const userRouter = Router();

userRouter.get('/',UserController.getAll as RequestHandler);
userRouter.get('/:uid',UserController.getById);
userRouter.patch('/:uid/block',UserController.blockUser);

export default userRouter;