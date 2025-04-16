import {connectiondb} from "../database/firebase";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";

class Report
{
    user: any;
    async find() {
       
        const snapshot = await connectiondb.collection("reportagens")
            .orderBy("data",'desc')
            .get();

        return snapshot.docs.map((doc: QueryDocumentSnapshot) => {
            const data = doc.data();
            return {
                ...data,
                uid: doc.id
            };
        });
    }

    async findById(uid:string) {
       
        const snapshot = await connectiondb.collection("reportagens")
            .doc(uid)
            .get()
            .then(snapshot => snapshot.data());
        return snapshot;
    }
    
}
export default Report;