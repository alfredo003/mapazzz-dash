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
exports.AuthorityController = void 0;
const Authority_1 = __importDefault(require("../models/Authority"));
class AuthorityController {
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authority = new Authority_1.default();
                const authorities = yield authority.find();
                res.status(200).json({ authorities });
            }
            catch (error) {
                res.status(500).json({
                    error: "Internal server error",
                });
            }
        });
    }
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = req.params;
            try {
                const report = new Authority_1.default();
                const reports = yield report.findById(uid);
                res.status(200).json({ reports });
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
                const { name, email, type, address, contact, uid } = req.body;
                if (!name || !email) {
                    return res.status(400).json({
                        error: "Missing required fields",
                        message: "Name, email are required"
                    });
                }
                const authority = new Authority_1.default();
                const authorityId = yield authority.create({
                    name,
                    uid: uid,
                    photo: "",
                    address,
                    type,
                    email,
                    contact,
                    password: "123456"
                });
                res.status(201).json({
                    message: "Authority created successfully",
                    user: authorityId
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
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const uid = req.params.uid;
                if (!uid) {
                    return res.status(400).json({
                        error: "Missing ID",
                        message: "Authority ID is required"
                    });
                }
                const authority = new Authority_1.default();
                const deleteauthority = yield authority.delete(uid);
                if (!deleteauthority) {
                    return res.status(404).json({
                        error: "Not found",
                        message: "Authority post not found"
                    });
                }
                res.status(200).json({
                    message: "Authority delete successfully",
                    award: deleteauthority
                });
            }
            catch (error) {
                res.status(500).json({
                    error: "Internal server error",
                    message: "Failed to delete authority"
                });
            }
        });
    }
}
exports.AuthorityController = AuthorityController;
