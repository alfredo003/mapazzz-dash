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

    async update(uid: string, data: Partial<Omit<UserData, 'createdAt' | 'resolvedCases'>>) {
        try {

            const authUpdates: any = {};
            if (data.email) authUpdates.email = data.email;
            if (data.password) authUpdates.password = data.password;
            if (data.name) authUpdates.displayName = data.name;
    
            if (Object.keys(authUpdates).length > 0) {
                await admin.auth().updateUser(uid, authUpdates);
            }
    
        
            const usersRef = connectiondb.collection("users");
            const snapshot = await usersRef.where("uid", "==", uid).get();
    
            if (snapshot.empty) {
                throw new Error(`No user found with UID: ${uid}`);
            }
    
            const docRef = snapshot.docs[0].ref;
    
            const firestoreUpdates: any = {};
            if (data.name) firestoreUpdates.name = data.name;
            if (data.email) firestoreUpdates.email = data.email;
            if (data.phoneNumber) firestoreUpdates.phoneNumber = data.phoneNumber;
            if (data.role) firestoreUpdates.role = data.role;
    
            await docRef.update(firestoreUpdates);
    
            return docRef;
        } catch (error) {
            console.error('Error updating user:', error);
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