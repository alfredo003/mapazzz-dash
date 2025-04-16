import { Router, RequestHandler } from "express";
import { AuthorityController } from "../controllers/AuthorityController";

const authorityRouter = Router();

authorityRouter.get('/', AuthorityController.getAll as RequestHandler);
authorityRouter.post('/', AuthorityController.create as RequestHandler);
authorityRouter.get('/:uid', AuthorityController.getById as RequestHandler);
authorityRouter.patch('/:uid/block', AuthorityController.block as RequestHandler);

export default authorityRouter;