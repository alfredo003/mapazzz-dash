import { Router } from "express";
import { ReportController } from "../controllers/ReportController";
import { authenticateToken } from "../middleware/auth";

const reportRouter = Router();

reportRouter.get('/',authenticateToken,ReportController.getAllReports);


export default reportRouter;