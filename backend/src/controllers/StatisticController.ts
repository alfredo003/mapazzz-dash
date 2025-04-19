import { Request, Response } from "express";
import Report from "../models/Report";
import Authority from "../models/Authority";
import User from "../models/User";
import { connectiondb } from "../database/firebase";


export class StatisticController {
    static async getCounts(req: Request, res: Response) {
        try {
            // Get reports count
            const report = new Report();
            const reports = await report.find();
            const reportsCount = reports.length;

            // Get authorities count
            const authority = new Authority();
            const authorities = await authority.find();
            const authoritiesCount = authorities.length;

            // Get users count
            const user = new User();
            const users = await user.find();
            const usersCount = users.length;

           
            const riskZonesSnapshot = await connectiondb.collection("risk_zones").get();
            const riskZonesCount = riskZonesSnapshot.size;

            res.status(200).json({
                statistics: {
                    reports: reportsCount,
                    authorities: authoritiesCount,
                    users: usersCount,
                  //  riskZones: riskZonesCount
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