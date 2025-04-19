import { Router, RequestHandler } from "express";
import { StatisticController } from "../controllers/StatisticController";

const statisticRouter = Router();

statisticRouter.get('/', StatisticController.getCounts as RequestHandler);

export default statisticRouter; 