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
const Award_1 = __importDefault(require("../models/Award"));
const User_1 = __importDefault(require("../models/User"));
class AwardController {
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const award = new Award_1.default();
                const awards = yield Award_1.default.find();
                res.status(200).json({ awards });
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
                const award = new Award_1.default();
                const awards = yield award.findById(uid);
                res.status(200).json({ awards });
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
    static getByclaimCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { claimcode } = req.params;
            try {
                const dataUser = new User_1.default();
                const users = yield dataUser.findAll();
                for (const user of users) {
                    const claimed = user.data.rewards;
                    const foundClaim = claimed.find((data) => data.claimCode === claimcode);
                    if (foundClaim && foundClaim.status !== 'claimed') {
                        return res.status(200).json(user);
                    }
                }
                return res.status(404).json({ message: "Claim code not found!" });
            }
            catch (error) {
                console.error('Error fetching reports:', error);
                return res.status(500).json({
                    error: "Internal server error",
                    message: "Failed to fetch reports"
                });
            }
        });
    }
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const award = new Award_1.default();
                const awards = yield award.create({
                    imageUrl,
                    points: convetPoint,
                    title,
                });
                res.status(201).json({
                    message: "award created successfully",
                    awards
                });
            }
            catch (error) {
                console.error('Error creating award:', error);
                res.status(500).json({
                    error: "Internal server error",
                    message: "Failed to create authority"
                });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const award = new Award_1.default();
                const awards = yield award.update(uid, {
                    imageUrl,
                    points: convetPoint,
                    title
                });
                res.status(200).json({
                    message: "award updated successfully",
                    awards
                });
            }
            catch (error) {
                console.error('Error updating award:', error);
                res.status(500).json({
                    error: "Internal server error",
                    message: "Failed to update award"
                });
            }
        });
    }
    static claim(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const uid = req.params.uid;
                if (!uid) {
                    return res.status(400).json({
                        error: "Missing ID",
                        message: "Award ID is required"
                    });
                }
                const award = new Award_1.default();
                const deleteAward = yield award.delete(uid);
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
            }
            catch (error) {
                //console.error('Error deleting award:', error);
                res.status(500).json({
                    error: "Internal server error",
                    message: "Failed to delete award"
                });
            }
        });
    }
}
exports.default = AwardController;
