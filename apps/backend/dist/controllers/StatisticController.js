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
exports.StatisticController = void 0;
const Report_1 = __importDefault(require("../models/Report"));
const Authority_1 = __importDefault(require("../models/Authority"));
const User_1 = __importDefault(require("../models/User"));
class StatisticController {
    static getCounts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const report = new Report_1.default();
                const reports = yield report.find();
                const reportsCount = reports.length;
                const authority = new Authority_1.default();
                const authorities = yield authority.find();
                const authoritiesCount = authorities.length;
                const user = new User_1.default();
                const users = yield user.findAll();
                const usersCount = users.length;
                const zoneRisks = new Report_1.default();
                const zoneRisk = yield zoneRisks.findZones();
                const zoneRiskCount = zoneRisk[0].zones.length;
                res.status(200).json({
                    statistics: {
                        reports: reportsCount,
                        authorities: authoritiesCount,
                        users: usersCount,
                        zoneRiskCount: zoneRiskCount
                    }
                });
            }
            catch (error) {
                console.error('Error fetching statistics:', error);
                res.status(500).json({
                    error: "Internal server error",
                    message: "Failed to fetch statistics"
                });
            }
        });
    }
    static getChart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const report = new Report_1.default();
                const reportsLow = yield report.findByRisk("low");
                const reportLowCount = reportsLow.length;
                const reportsMedium = yield report.findByRisk("medium");
                const reportMediumCount = reportsMedium.length;
                const reportshigh = yield report.findByRisk("high");
                const reportHighCount = reportshigh.length;
                res.status(200).json({
                    statistics: {
                        reportLowCount,
                        reportMediumCount,
                        reportHighCount
                    }
                });
            }
            catch (error) {
                console.error('Error fetching statistics:', error);
                res.status(500).json({
                    error: "Internal server error",
                    message: "Failed to fetch statistics"
                });
            }
        });
    }
}
exports.StatisticController = StatisticController;
