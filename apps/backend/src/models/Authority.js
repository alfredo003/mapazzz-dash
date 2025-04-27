"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("../database/firebase");
const firestore_1 = require("firebase-admin/firestore");
class Authority {
    find() {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield firebase_1.connectiondb.collection("authorities")
                .orderBy("name", 'asc')
                .get();
            return snapshot.docs.map((doc) => (Object.assign(Object.assign({}, doc.data()), { uid: doc.id })));
        });
    }
    findById(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield firebase_1.connectiondb.collection("authorities")
                .doc(uid)
                .get();
            return doc.data();
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const docRef = yield firebase_1.connectiondb.collection("authorities").add({
                    name: data.name,
                    photo: data.photo,
                    address: data.address,
                    type: data.type,
                    email: data.email,
                    contact: data.contact,
                    uid: data.uid,
                    resolvedCases: 0,
                    createdAt: firestore_1.Timestamp.now()
                });
                const docRefUser = yield firebase_1.connectiondb.collection("users").add({
                    name: data.name,
                    address: data.address,
                    type: data.type,
                    email: data.email,
                    contact: data.contact,
                    uid: data.uid,
                    role: "authority",
                    createdAt: firestore_1.Timestamp.now()
                });
                return docRefUser;
            }
            catch (error) {
                console.error('Error creating authority:', error);
                throw error;
            }
        });
    }
    delete(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const docRef = firebase_1.connectiondb.collection("authorities").doc(uid);
                yield docRef.delete();
                const docRefUser = firebase_1.connectiondb.collection("users").doc(uid);
                yield docRefUser.delete();
                return { message: `authority with uid ${uid} successfully deleted.` };
            }
            catch (error) {
                console.error('Error deleting award:', error);
                throw error;
            }
        });
    }
}
exports.default = Authority;
