import { RequestHandler, Router } from "express";
import { ReportController } from "../controllers/ReportController";


const reportRouter = Router();

reportRouter.get('/',ReportController.getAllReports as RequestHandler);
reportRouter.get('/zonas',ReportController.getAllZones as RequestHandler);
reportRouter.get('/status/:status',ReportController.getAllReportsByStatus);

reportRouter.get('/:uid',ReportController.getReportById as RequestHandler);

export default reportRouter;