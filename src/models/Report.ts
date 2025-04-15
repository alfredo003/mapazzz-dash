import {connectiondb} from "../database/firebase";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";

class Report
{
    user: any;
    async findByReport() {
        if (!this.user?.uid) {
            return Promise.reject({
                code: 500,
                message: "Usuário nao informado"
            });
        }
        const snapshot = await connectiondb.collection("reportagens")
            .orderBy("date",'desc')
            .get();

        return snapshot.docs.map((doc: QueryDocumentSnapshot) => {
            const data = doc.data();
            return {
                ...data,
                uid: doc.id
            };
        });
    }
}
export default Report;