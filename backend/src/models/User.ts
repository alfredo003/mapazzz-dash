import {connectiondb} from "../database/firebase";
import { QueryDocumentSnapshot, Timestamp } from "firebase-admin/firestore";
import admin from 'firebase-admin';

interface UserData {
    name:  string,
    email: string,
    phoneNumber: string,
    role:string,
    password:string
}

class User
{

    async create(data: Omit<UserData, 'createdAt' | 'resolvedCases'> ) {
        try {
            const userRecord = await admin.auth().createUser({
                email: data.email,
                password: data.password,
                displayName: data.name
            });

            const docRef = await connectiondb.collection("users").add({
                name:  data.name,
                email:  data.email,
                phoneNumber: data.phoneNumber,
                role:data.role,
                uid:userRecord.uid,
                createdAt: Timestamp.now() 
            });

            return docRef;
        } catch (error) {
            console.error('Error creating authority:', error);
            throw error;
        }
    }

     async find() {
        const snapshot = await connectiondb.collection("users").get();

        return snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
            ...doc.data(),
            uid: doc.id
       })
        );
    }

    async findById(uid: string) {
        const snapshot = await connectiondb.collection("users")
            .where("uid", "==", uid)
            .get();
        return snapshot.docs.map((doc: QueryDocumentSnapshot) => {
            const data = doc.data();
            return {
                ...data,
                uid: doc.id
            };
        });
    }
    async updatePass(uid: string, newPass: string) {
        try {
            
            await admin.auth().updateUser(uid, {
                password: newPass
            });
    
            return { message: 'Senha atualizada com sucesso' };
        } catch (error) {
            console.error('Erro ao atualizar a senha:', error);
            throw error;
        }
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