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
exports.UserController = void 0;
const User_1 = __importDefault(require("../models/User"));
class UserController {
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, phoneNumber, role, password, uid } = req.body;
                if (!name || !email || !phoneNumber || !role) {
                    return res.status(400).json({
                        error: "Missing required fields",
                        message: "Name, email and tel are required"
                    });
                }
                const user = new User_1.default();
                const userId = yield user.create({
                    name,
                    email,
                    phoneNumber,
                    role,
                    password,
                    uid,
                    status: 'active',
                });
                res.status(201).json({
                    message: "user created successfully",
                    uid: userId
                });
            }
            catch (error) {
                console.error('Error creating user:', error);
                res.status(500).json({
                    error: "Internal server error",
                    message: "Failed to create user"
                });
            }
        });
    }
    static updatePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { uid, newPassword } = req.body;
                if (!uid || !newPassword) {
                    return res.status(400).json({
                        error: "Missing required fields",
                        message: "UID and new password are required"
                    });
                }
                const user = new User_1.default();
                const result = yield user.updatePass(uid, newPassword);
                if (!result) {
                    return res.status(404).json({
                        error: "User not found",
                        message: "No user found with the provided UID"
                    });
                }
                res.status(200).json({
                    message: "Password updated successfully"
                });
            }
            catch (error) {
                console.error('Error updating password:', error);
                res.status(500).json({
                    error: "Internal server error",
                    message: "Failed to update password"
                });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { name, email, phoneNumber, role, password } = req.body;
                if (!id) {
                    return res.status(400).json({
                        error: "Missing user ID",
                        message: "User ID is required for update"
                    });
                }
                if (!name && !email && !phoneNumber && !role && !password) {
                    return res.status(400).json({
                        error: "Missing fields to update",
                        message: "At least one field (name, email, phoneNumber, role, password) must be provided"
                    });
                }
                const user = new User_1.default();
                const updated = yield user.update(id, {
                    name,
                    email,
                    phoneNumber,
                    role,
                    password
                });
                if (!updated) {
                    return res.status(404).json({
                        error: "User not found",
                        message: "No user found with the given ID"
                    });
                }
                res.status(200).json({
                    message: "User updated successfully"
                });
            }
            catch (error) {
                console.error('Error updating user:', error);
                res.status(500).json({
                    error: "Internal server error",
                    message: "Failed to update user"
                });
            }
        });
    }
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = new User_1.default();
                const users = yield user.findAll();
                res.status(200).json({ users });
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
                const user = new User_1.default();
                const userData = yield user.findById(uid);
                res.status(200).json({ userData });
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
    static claimed(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid, claimcode } = req.body;
            try {
                const user = new User_1.default();
                const userData = yield user.updateRewardStatus(uid, claimcode, 'claimed');
                ;
                res.status(200).json(userData);
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
    static blockUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = req.params;
            try {
                const user = new User_1.default();
                const userData = yield user.block(uid);
                res.status(200).json({ userData });
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
}
exports.UserController = UserController;
