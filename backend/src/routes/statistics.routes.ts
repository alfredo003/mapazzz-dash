import { Router } from "express";
import { StatisticController } from "../controllers/StatisticController";


const statisticsRouter = Router();

statisticsRouter.get('/',StatisticController.getCounts);

export default statisticsRouter;