import { Request, Response } from "express";
import Report from "../models/Report";
import Authority from "../models/Authority";
import User from "../models/User";
import { connectiondb } from "../database/firebase";


export class StatisticController {
    static async getCounts(req: Request, res: Response) {
        try {

            const report = new Report();
            const reports = await report.find();
            const reportsCount = reports.length;

            const authority = new Authority();
            const authorities = await authority.find();
            const authoritiesCount = authorities.length;


            const user = new User();
            const users = await user.find();
            const usersCount = users.length;

           
            const zoneRisks = new Report();
            const zoneRisk = await zoneRisks.findZones();
            const zoneRiskCount = zoneRisk[0].zones.length;

            res.status(200).json({
                statistics: {
                    reports: reportsCount,
                    authorities: authoritiesCount,
                    users: usersCount,
                    zoneRiskCount:zoneRiskCount
                }
            });
        } catch (error) {
            console.error('Error fetching statistics:', error);
            res.status(500).json({
                error: "Internal server error",
                message: "Failed to fetch statistics"
            });
        }
    }

    static async getChart(req: Request, res: Response) {
        try {

            const report = new Report();

            const reportsLow = await report.findByRisk("low");
            const reportLowCount = reportsLow.length;

            const reportsMedium= await report.findByRisk("medium");
            const reportMediumCount = reportsMedium.length;

            const reportshigh = await report.findByRisk("high");
            const reportHighCount = reportshigh.length;


            res.status(200).json({
                statistics: {
                    reportLowCount,
                    reportMediumCount,
                    reportHighCount
                }
            });
        } catch (error) {
            console.error('Error fetching statistics:', error);
            res.status(500).json({
                error: "Internal server error",
                message: "Failed to fetch statistics"
            });
        }
    }
}