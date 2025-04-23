import { Router, RequestHandler } from "express";
import { BlogController } from "../controllers/BlogController";

const blogRouter = Router();

blogRouter.get('/', BlogController.getAll as RequestHandler);
blogRouter.get('/:uid', BlogController.getById as RequestHandler);
blogRouter.post('/', BlogController.create as RequestHandler);
blogRouter.put('/:uid', BlogController.update as RequestHandler);

export default blogRouter;