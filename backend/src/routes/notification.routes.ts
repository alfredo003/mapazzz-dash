import { Router, RequestHandler } from "express";
import { NotificationController } from "../controllers/NotificationController";

const notificationRoutes = Router();

notificationRoutes.get('/', NotificationController.findAll as unknown as RequestHandler);
notificationRoutes.get('/fcm', NotificationController.findAllFcm as unknown as RequestHandler);
notificationRoutes.post('/send', NotificationController.sendNotification as unknown as RequestHandler);

export default notificationRoutes; 