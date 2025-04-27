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
exports.NotificationController = void 0;
const Notification_1 = __importDefault(require("../models/Notification"));
class NotificationController {
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, message, userId } = req.body;
            try {
                const notif = new Notification_1.default();
                const notificationSave = yield notif.create({
                    IdUser: userId || null,
                    body: message,
                    createdAt: new Date(),
                    title: title
                });
                return res.status(201).json({ notificationSave });
            }
            catch (error) {
                console.error('Error sending notification:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    static findAllFcm(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const notif = new Notification_1.default();
            const fcm = yield notif.getFCMToken();
            return res.status(200).json(fcm);
        });
    }
    static sendNotification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, message, token, userId } = req.body;
            try {
                const notif = (new Notification_1.default(title, message, token));
                const result = yield notif.sendPush();
                const notificationSave = yield notif.create({
                    IdUser: userId,
                    body: message,
                    createdAt: new Date(),
                    title: title
                });
                return res.status(201).json({ result, notificationSave });
            }
            catch (error) {
                console.error('Error sending notification:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    static findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notif = new Notification_1.default();
                const notifications = yield notif.find();
                return res.status(200).json(notifications);
            }
            catch (error) {
                console.error('Error fetching notifications:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    static findById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const notif = new Notification_1.default();
                const notification = yield notif.findById(id);
                if (!notification) {
                    return res.status(404).json({ error: 'Notification not found' });
                }
                return res.status(200).json(notification);
            }
            catch (error) {
                console.error('Error fetching notification:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
}
exports.NotificationController = NotificationController;
