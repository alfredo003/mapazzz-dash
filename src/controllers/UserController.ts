import { Request, Response } from "express";
import User from "../models/User";

export class UserController {
    static async getAll(req: Request, res: Response) {
        try {
            const user = new User();
            const users = await user.find();
            res.status(200).json({ users });
        } catch (error) {
            console.error('Error fetching reports:', error);
            res.status(500).json({
                error: "Internal server error",
                message: "Failed to fetch reports"
            });
        }
    }

    static async getById(req: Request, res: Response) {
        const {uid} = req.params;
        try {
            const user = new User();
            const userData = await user.findById(uid);
            res.status(200).json({ userData });
        } catch (error) {
            console.error('Error fetching reports:', error);
            res.status(500).json({
                error: "Internal server error",
                message: "Failed to fetch reports"
            });
        }
    }
    
    static async blockUser(req: Request, res: Response) {
        const {uid} = req.params;
        try {
            const user = new User();
            const userData = await user.block(uid);
            res.status(200).json({ userData });
        } catch (error) {
            console.error('Error fetching reports:', error);
            res.status(500).json({
                error: "Internal server error",
                message: "Failed to fetch reports"
            });
        }
    }
}