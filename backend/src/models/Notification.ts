import {connectiondb} from "../database/firebase";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import * as admin from 'firebase-admin';

interface NotificationData {
    IdUser: string,
    body: string,
   createdAt: Date, 
 title: string
}

class Notification {
    

    async create(notification: NotificationData) {
        try {
            const docRef = await connectiondb.collection("notifications").add(notification);
            
            return docRef;
        } catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        }
    }

    async getFCMToken() {
        const snapshot = await connectiondb.collection("fcm").get();
        return snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
            ...doc.data()
        }));
    }

    async sendPushNotification({ token, title, message }: { token: string, title: string, message: string })
    {
        try {
            const data = {
                notification: {
                    title: title,
                    body: message
                },
                token: token
            };

            const response = await admin.messaging().send(data);
          
            return response;
        } catch (error) {
            console.error('Error sending notification:', error);
            throw error;
        }
    }
    
    async find() {
        const snapshot = await connectiondb.collection("notifications").get();
        return snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
            ...doc.data(),
            uid: doc.id
        }));
    }

    async findById(uid: string) {
        const snapshot = await connectiondb.collection("notifications")
            .doc(uid)
            .get();
        return snapshot.exists ? { ...snapshot.data(), uid: snapshot.id } : null;
    }

    async findByUserId(userId: string) {
        const snapshot = await connectiondb.collection("notifications")
            .where("userId", "==", userId)
            .get();
        return snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
            ...doc.data(),
            uid: doc.id
        }));
    }

}

export default Notification;