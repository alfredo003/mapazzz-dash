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
            const { name, photo, email, tel,password } = req.body;
            
            if (!name || !email || !tel || !password) {
                return res.status(400).json({
                    error: "Missing required fields",
                    message: "Name, email and tel are required"
                });
            }

            const authority = new Authority();
            const authorityId = await authority.create({
                name,
                photo: photo || "",
                email,
                tel,
                password
            });

            res.status(201).json({
                message: "Authority created successfully",
                uid: authorityId
            });

        } catch (error) {
            console.error('Error creating authority:', error);
            res.status(500).json({
                error: "Internal server error",
                message: "Failed to create authority"
            });
        }
    }

    static async block(req: Request, res: Response) {
        const { uid } = req.params;
        try {
            const authority = new Authority();
            await authority.block(uid);
            
            res.status(200).json({
                message: "Authority blocked successfully"
            });
        } catch (error) {
            console.error('Error blocking authority:', error);
            res.status(500).json({
                error: "Internal server error",
                message: "Failed to block authority"
            });
        }
    }
}