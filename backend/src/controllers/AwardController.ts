import { Request, Response } from "express";
import Award from "../models/Award";

class AwardController {
    static async getAll(req: Request, res: Response) {
        try {
            const award = new Award();
            const awards = await Award.find();
            res.status(200).json({ awards });
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
            const award = new Award();
            const awards = await award.findById(uid);
            res.status(200).json({ awards });
        } catch (error) {
            console.error('Error fetching reports:', error);
            res.status(500).json({
                error: "Internal server error",
                message: "Failed to fetch reports"
            });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const { imageUrl, points, title } = req.body;
            
            const randomDigits = Math.floor(10000 + Math.random() * 90000);

            const titleLetters = title.substring(0, 2).toUpperCase();

            const id = `${titleLetters}${randomDigits}`;

            if (!imageUrl || !points || !title) {
                return res.status(400).json({
                    error: "Missing required fields",
                    message: "points or title and tel are required"
                });
            }

            const award = new Award();
            const awards = await award.create({
                id,
                imageUrl,
                points,
                title,
            });

            res.status(201).json({
                message: "award created successfully",
                awards
            });

        } catch (error) {
            console.error('Error creating award:', error);
            res.status(500).json({
                error: "Internal server error",
                message: "Failed to create authority"
            });
        }
    }
}

export default AwardController;