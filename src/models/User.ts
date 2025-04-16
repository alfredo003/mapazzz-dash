import {connectiondb} from "../database/firebase";
import { QueryDocumentSnapshot, Timestamp } from "firebase-admin/firestore";
import admin from 'firebase-admin';


class User
{

     async find() {
        const snapshot = await admin.auth().listUsers();
       
        return snapshot.users.map((user) => {
            return {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                phoneNumber: user.phoneNumber,
                photoURL: user.photoURL,
                disabled: user.disabled,
            };
        });
    }

    async findById(uid: string) {
        const doc = await  admin.auth().getUser(uid);
        return doc;
    }
    
    async block(uid: string) {
        try {

            await admin.auth().updateUser(uid, {
                disabled: true
            });
        
            return { message: 'User blocked successfully' };
        } catch (error) {
            console.error('Error blocking authority:', error);
            throw error;
        }
    }
}
export default User;