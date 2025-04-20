import { RequestHandler, Router } from "express";
import  AwardController  from "../controllers/AwardController";


const awardRouter = Router();

awardRouter.get('/',AwardController.getAll);
awardRouter.get('/:uid',AwardController.getById);
awardRouter.post('/',AwardController.create as RequestHandler);


export default awardRouter;