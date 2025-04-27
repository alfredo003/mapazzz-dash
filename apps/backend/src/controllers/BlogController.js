"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogController = void 0;
const Blog_1 = __importDefault(require("../models/Blog"));
class BlogController {
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blog = new Blog_1.default();
                const blogs = yield Blog_1.default.find();
                res.status(200).json({ blogs });
            }
            catch (error) {
                console.error('Error fetching reports:', error);
                res.status(500).json({
                    error: "Internal server error",
                    message: "Failed to fetch reports"
                });
            }
        });
    }
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = req.params;
            try {
                const blog = new Blog_1.default();
                const blogs = yield blog.findById(uid);
                res.status(200).json({ blogs });
            }
            catch (error) {
                console.error('Error fetching reports:', error);
                res.status(500).json({
                    error: "Internal server error",
                    message: "Failed to fetch reports"
                });
            }
        });
    }
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { content, imageUrl, title } = req.body;
                if (!content || !imageUrl || !title) {
                    return res.status(400).json({
                        error: "Missing required fields",
                        message: "Name, email and tel are required"
                    });
                }
                const blog = new Blog_1.default();
                const blogs = yield blog.create({
                    content,
                    imageUrl,
                    title
                });
                res.status(201).json({
                    message: "Authority created successfully",
                    blogs
                });
            }
            catch (error) {
                console.error('Error creating authority:', error);
                res.status(500).json({
                    error: "Internal server error",
                    message: "Failed to create authority"
                });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.uid;
                const { content, imageUrl, title } = req.body;
                if (!id) {
                    return res.status(400).json({
                        error: "Missing ID",
                        message: "Blog ID is required"
                    });
                }
                const blog = new Blog_1.default();
                const updatedBlog = yield blog.update(id, {
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
            }
            catch (error) {
                console.error('Error updating blog:', error);
                res.status(500).json({
                    error: "Internal server error",
                    message: "Failed to update blog"
                });
            }
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const uid = req.params.uid;
                if (!uid) {
                    return res.status(400).json({
                        error: "Missing ID",
                        message: "Blog ID is required"
                    });
                }
                const blog = new Blog_1.default();
                const deleteBlog = yield blog.delete(uid);
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
            }
            catch (error) {
                console.error('Error deleting blog:', error);
                res.status(500).json({
                    error: "Internal server error",
                    message: "Failed to delete blog"
                });
            }
        });
    }
}
exports.BlogController = BlogController;
