import { Request, Response } from "express";
import Blog from "../models/Blog";
import Notification from "../models/Notification";
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

            const dataNofity = {
                title:"Novo Blog",
                message:title
            }
           
            const resultNotify = (new Notification(dataNofity.title,dataNofity.message))
            await resultNotify.sendPush();
            
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
 
    static async update(req: Request, res: Response) {
        try {
            const id = req.params.uid;
            const { content, imageUrl, title } = req.body;
            
            if (!id) {
                return res.status(400).json({
                    error: "Missing ID",
                    message: "Blog ID is required"
                });
            }

            const blog = new Blog();
            const updatedBlog = await blog.update(id, {
                content,
                imageUrl,
                title
            });

            if (!updatedBlog) {
                return res.status(404).json({
                    error: "Not found",
                    message: "Blog post not found"
                });
            }

            res.status(200).json({
                message: "Blog updated successfully",
                blog: updatedBlog
            });

        } catch (error) {
            console.error('Error updating blog:', error);
            res.status(500).json({
                error: "Internal server error",
                message: "Failed to update blog"
            });
        }
    }

    static async delete(req: Request, res: Response)
    {
        try{
            const uid = req.params.uid;
            
            if (!uid) {
                return res.status(400).json({
                    error: "Missing ID",
                    message: "Blog ID is required"
                });
            }
            const blog = new Blog();
            const deleteBlog = await blog.delete(uid);

            if (!deleteBlog) {
                return res.status(404).json({
                    error: "Not found",
                    message: "Blog post not found"
                });
            }

            res.status(200).json({
                message: "Blog updated successfully",
                blog: deleteBlog
            });

        } catch (error) {
            console.error('Error deleting blog:', error);
            res.status(500).json({
                error: "Internal server error",
                message: "Failed to delete blog"
            });
        }
    }
}