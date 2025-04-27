import { Request, Response } from "express";
import Award from "../models/Award";
import Notification from "../models/Notification";
import User from "../models/User";

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

    static async getByclaimCode(req: Request, res: Response) {
        const { claimcode } = req.params;
        try {
            const dataUser = new User();
            const users = await dataUser.findAll();
        
        for (const user of users) {
            
          const claimed = user.data.rewards;
          const foundClaim = claimed.find((data: { claimCode: string }) => data.claimCode === claimcode);
            
         if (foundClaim && foundClaim.status !== 'claimed') {
                return res.status(200).json(user);
            }
        }
        
        return res.status(404).json({ message: "Claim code not found!" });
        } catch (error) {
            console.error('Error fetching reports:', error);
            return res.status(500).json({
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

    static async claim(req: Request, res: Response) {
        const { claimCode, rewardId } = req.body;
        
        if (!claimCode || !rewardId) {
            return res.status(400).json({
                error: "Missing required fields",
                message: "points or title and tel are required"
            });
        }
        /*try {
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
        }*/
    }

    static async delete(req: Request, res: Response)
    {
        try{
            const uid = req.params.uid;
            
            if (!uid) {
                return res.status(400).json({
                    error: "Missing ID",
                    message: "Award ID is required"
                });
            }

            const award = new Award();
            const deleteAward = await award.delete(uid);

            if (!deleteAward) {
                return res.status(404).json({
                    error: "Not found",
                    message: "Award post not found"
                });
            }

            res.status(200).json({
                message: "Award delete successfully",
                award: deleteAward
            });

        } catch (error) {
            //console.error('Error deleting award:', error);
            res.status(500).json({
                error: "Internal server error",
                message: "Failed to delete award"
            });
        }
    }
}

export default AwardController;