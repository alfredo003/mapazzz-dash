import { Request, Response } from "express";
import Blog from "../models/Blog";

export class BlogController {
    static async getAll(req: Request, res: Response) {
        try {
            const blog = new Blog();
            const blogs = await Blog.find();
            res.status(200).json({ blogs });
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
            const blog = new Blog();
            const blogs = await blog.findById(uid);
            res.status(200).json({ blogs });
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
            const { content, imageUrl, title } = req.body;
            
            if (!content || !imageUrl || !title) {
                return res.status(400).json({
                    error: "Missing required fields",
                    message: "Name, email and tel are required"
                });
            }

            const blog = new Blog();
            const blogs = await blog.create({
                content,
                imageUrl,
                title
            });

            res.status(201).json({
                message: "Authority created successfully",
                blogs
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