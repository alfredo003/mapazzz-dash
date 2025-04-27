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
class Award {
    static find() {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield firebase_1.connectiondb.collection("reward").get();
            return snapshot.docs.map((doc) => (Object.assign(Object.assign({}, doc.data()), { uid: doc.id })));
        });
    }
    findById(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield firebase_1.connectiondb.collection("reward")
                .doc(uid)
                .get();
            return doc.data();
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const docRef = yield firebase_1.connectiondb.collection("reward").add({
                    imageUrl: data.imageUrl,
                    points: data.points,
                    title: data.title
                });
                return docRef;
            }
            catch (error) {
                console.error('Error creating authority:', error);
                throw error;
            }
        });
    }
    update(uid, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const docRef = firebase_1.connectiondb.collection("reward").doc(uid);
                yield docRef.update({
                    imageUrl: data.imageUrl,
                    points: data.points,
                    title: data.title
                });
                return docRef;
            }
            catch (error) {
                console.error('Error updating award:', error);
                throw error;
            }
        });
    }
    delete(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const docRef = firebase_1.connectiondb.collection("reward").doc(uid);
                yield docRef.delete();
                return { message: `Award with uid ${uid} successfully deleted.` };
            }
            catch (error) {
                console.error('Error deleting award:', error);
                throw error;
            }
        });
    }
}
exports.default = Award;
