import {connectiondb} from "../database/firebase";
import { QueryDocumentSnapshot, Timestamp } from "firebase-admin/firestore";
import * as admin from 'firebase-admin';

interface BlogData {
    content: string;
    imgUrl: string;
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
                imgUrl: data.imgUrl,
                title: data.title
            });

            return docRef;
        } catch (error) {
            console.error('Error creating authority:', error);
            throw error;
        }
    }

    
}
export default Blog;