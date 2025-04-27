import { Router, RequestHandler } from "express";
import { AuthorityController } from "../controllers/AuthorityController";

const authorityRouter = Router();

authorityRouter.get('/', AuthorityController.getAll as RequestHandler);
authorityRouter.post('/', AuthorityController.create as RequestHandler);
authorityRouter.get('/:uid', AuthorityController.getById as RequestHandler);
authorityRouter.delete('/:uid', AuthorityController.delete as RequestHandler);

export default authorityRouter; 