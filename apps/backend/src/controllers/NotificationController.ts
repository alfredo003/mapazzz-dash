import { Request, Response } from "express";
import Notification from "../models/Notification";

export class NotificationController
{

    static async register(req: Request, res: Response) {
        const {title, message,userId} = req.body;
        try {
        
            const notif = new Notification();
            
            const notificationSave = await notif.create({
                IdUser: userId  || null,
                body: message,
                createdAt: new Date(), 
                title: title
            });

            return res.status(201).json({notificationSave});
        } catch (error) {
            console.error('Error sending notification:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async findAllFcm(req: Request, res: Response) {
        const notif = new Notification();
        const fcm = await notif.getFCMToken();
        return res.status(200).json(fcm);
    }

      static async sendNotification(req: Request, res: Response) {
        const {title, message, token,userId} = req.body;
        try {
            const notif = (new Notification(title, message, token));
            const result = await notif.sendPush();
            
            const notificationSave = await notif.create({
                IdUser: userId,
                body: message,
                createdAt: new Date(), 
                title: title
            });


            return res.status(201).json({result, notificationSave});
        } catch (error) {
            console.error('Error sending notification:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async findAll(req: Request, res: Response) {
        try {
            const notif = new Notification();
            const notifications = await notif.find();
            return res.status(200).json(notifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async findById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const notif = new Notification();
            const notification = await notif.findById(id);
            
            if (!notification) {
                return res.status(404).json({ error: 'Notification not found' });
            }

            return res.status(200).json(notification);
        } catch (error) {
            console.error('Error fetching notification:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }


}