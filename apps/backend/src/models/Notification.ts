import {connectiondb} from "../database/firebase";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import * as admin from 'firebase-admin';

interface NotificationData
{
    IdUser: string,
    body: string,
    createdAt: Date, 
    title: string
}

class Notification
{
    private title: string;
    private message: string;

    constructor(title?:string,message?:string)
    {
        this.title = title || "";
        this.message = message || "";
    }
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

    async sendPush()
    {
        try {
         
            const result = await this.getFCMToken(); 
            const tokens = result[0].token;

            const data = {
                notification: {
                    title: this.title,
                    body: this.message
                }
            };

            for (const token of tokens)
            {
                try {  
                   const res = await admin.messaging().send({
                    data:data.notification,
                    token:token
                   });
                    console.log(`Enviado com sucesso: ${res}`);
                } catch (error) {
                    console.error(`Erro ao enviar o token ${token}:`, error);
                }
            }

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

}

export default Notification;