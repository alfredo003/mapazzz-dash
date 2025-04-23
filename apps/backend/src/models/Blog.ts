import {connectiondb} from "../database/firebase";
import { QueryDocumentSnapshot, Timestamp } from "firebase-admin/firestore";
import * as admin from 'firebase-admin';

interface BlogData {
    content: string;
    imageUrl: string;
    title: string;
}

class Blog
{
    static async find() {
        const snapshot = await connectiondb.collection("blog").get();

        return snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
            ...doc.data(),
            uid: doc.id
        }));
    }

    async findById(uid: string) {
        const doc = await connectiondb.collection("blog")
            .doc(uid)
            .get();
        return doc.data();
    }

    async create(data: Omit<BlogData, 'createdAt'>) {
        try {
            const docRef = await connectiondb.collection("blog").add({
                body: data.content,
                imageUrl: data.imageUrl,
                title: data.title
            });

            return docRef;
        } catch (error) {
            console.error('Error creating authority:', error);
            throw error;
        }
    }

    async update(uid: string, data: Partial<BlogData>) {
        try {
            const docRef = connectiondb.collection("blog").doc(uid);
            await docRef.update({
                body: data.content,
                imageUrl: data.imageUrl,
                title: data.title
            });

            return docRef;
        } catch (error) {
            console.error('Error updating blog:', error);
            throw error;
        }
    }

    async delete(uid: string) {
        try {
            const docRef = connectiondb.collection("blog").doc(uid);
    
            await docRef.delete();
    
            return { message: `Blog with uid ${uid} successfully deleted.` };
        } catch (error) {
            console.error('Error deleting blog:', error);
            throw error;
        }
    }
}
export default Blog;