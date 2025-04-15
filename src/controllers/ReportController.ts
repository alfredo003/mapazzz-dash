import { Response } from "express";
import Report from "../models/Report";
import { CustomRequest } from "../types/express";

export class ReportController {

    static getAllReports(req: CustomRequest, res: Response) 
    {
        const report = new Report();
        report.user = req.user;

        report.findByReport().then((reports: any[]) =>{
            res.json(reports);
        }).catch((error: { code: number }) =>{
            res.status(error.code).json(error);
        })
        
      }

}