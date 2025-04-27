import { Request, Response } from "express";
import  Authority  from "../models/Authority";

export class AuthorityController {
    static async getAll(req: Request, res: Response) {
        try {
            const authority = new Authority();
            const authorities = await authority.find();
            res.status(200).json({ authorities });
        } catch (error) {
            res.status(500).json({
                error: "Internal server error",
            });
        }
    }

    static async getById(req: Request, res: Response) {
        const {uid} = req.params;
        try {
            const report = new Authority();
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
 
    static async create(req: Request, res: Response) {
        try {
            const { name, email, type, address, contact,uid } = req.body; 
            
            
            if (!name || !email) {
                return res.status(400).json({
                    error: "Missing required fields",
                    message: "Name, email are required"
                });
            }

           const authority = new Authority();
            const authorityId = await authority.create({
                name,
                uid:uid,
                photo:"",
                address,
                type,
                email,
                contact,
                password:"123456"
            });

            res.status(201).json({
                message: "Authority created successfully",
                user: authorityId
            }); 
            
        } catch (error) {
            console.error('Error creating authority:', error);
            res.status(500).json({
                error: "Internal server error",
                message: "Failed to create authority"
            });
        }
    }

}