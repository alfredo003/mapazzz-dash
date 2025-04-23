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
            const convetPoint = Number(points);
            const award = new Award();
            const awards = await award.create({
                imageUrl,
                points:convetPoint,
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

    static async update(req: Request, res: Response) {
        const { uid } = req.params;
        const { imageUrl, points, title } = req.body;
        
        if (!imageUrl || !points || !title) {
            return res.status(400).json({
                error: "Missing required fields",
                message: "points or title and tel are required"
            });
        }
        try {
            const convetPoint = Number(points);
            const award = new Award();
            const awards = await award.update(uid, {
                imageUrl,
                points:convetPoint,
                title
            });

            res.status(200).json({
                message: "award updated successfully",
                awards
            });
        } catch (error) {
            console.error('Error updating award:', error);
            res.status(500).json({
                error: "Internal server error",
                message: "Failed to update award"
            });
        }
    }
}

export default AwardController;