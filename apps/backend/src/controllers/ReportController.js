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
exports.ReportController = void 0;
const Report_1 = __importDefault(require("../models/Report"));
class ReportController {
    static getAllReports(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const report = new Report_1.default();
                const reports = yield report.find();
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
    static getAllZones(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const report = new Report_1.default();
                const zones = yield report.findAllZonas();
                res.status(200).json({ zones });
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
    static getAllReportsByStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { status } = req.params;
            try {
                const report = new Report_1.default();
                const reports = yield report.findByStatus(status);
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
    static getReportById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = req.params;
            try {
                const report = new Report_1.default();
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
}
exports.ReportController = ReportController;
