import {connectiondb} from "../database/firebase";
import { QueryDocumentSnapshot, Timestamp } from "firebase-admin/firestore";
import * as admin from 'firebase-admin';

interface AuthorityData {
    name: string;
    photo: string;
    email: string;
    tel: string;
    resolvedCases: number;
    createdAt: Timestamp;
    isBlocked?: boolean;
}

class Authority
{
    async find() {
        const snapshot = await connectiondb.collection("authorities")
            .orderBy("name", 'asc')
            .get();

        return snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
            ...doc.data(),
            uid: doc.id
        }));
    }

    async findById(uid: string) {
        const doc = await connectiondb.collection("authorities")
            .doc(uid)
            .get();
        return doc.data();
    }

    async create(data: Omit<AuthorityData, 'createdAt' | 'resolvedCases'> & { password: string }) {
        try {
            const userRecord = await admin.auth().createUser({
                email: data.email,
                password: data.password,
                displayName: data.name
            });

            const docRef = await connectiondb.collection("authorities").add({
                name: data.name,
                email: data.email,
                tel: data.tel,
                resolvedCases: 0,
                createdAt: Timestamp.now(),
                uid: userRecord.uid,
                isBlocked: false
            });

            return userRecord.uid;
        } catch (error) {
            console.error('Error creating authority:', error);
            throw error;
        }
    }

    
}
export default Authority;