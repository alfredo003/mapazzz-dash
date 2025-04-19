import { Request, Response } from "express";
import Report from "../models/Report";

export class ReportController {
    static async getAllReports(req: Request, res: Response) {
        try {
            const report = new Report();
            const reports = await report.find();
            res.status(200).json({ reports });
        } catch (error) {
            console.error('Error fetching reports:', error);
            res.status(500).json({
                error: "Internal server error",
                message: "Failed to fetch reports"
            });
        }
    }
    static async getAllReportsByStatus(req: Request, res: Response) {
        const {status} = req.params;
        try {
            const report = new Report();
            const reports = await report.findByStatus(status);
            res.status(200).json({ reports });
        } catch (error) {
            console.error('Error fetching reports:', error);
            res.status(500).json({
                error: "Internal server error",
                message: "Failed to fetch reports"
            });
        }
    }

    static async getReportById(req: Request, res: Response) {
        const {uid} = req.params;
        try {
            const report = new Report();
            const reports = await report.findById(uid);
            res.status(200).json({ reports });
        } catch (error) {
            console.error('Error fetching reports:', error);
            res.status(500).json({
                error: "Internal server error",
                message: "Failed to fetch reports"
            });
        }
    }
}