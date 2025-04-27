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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("../database/firebase");
const firestore_1 = require("firebase-admin/firestore");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
class User {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const docRef = yield firebase_1.connectiondb.collection("users").add({
                    name: data.name,
                    email: data.email,
                    phoneNumber: data.phoneNumber,
                    role: data.role,
                    uid: data.uid,
                    status: data.status,
                    createdAt: firestore_1.Timestamp.now()
                });
                return docRef;
            }
            catch (error) {
                console.error('Error creating authority:', error);
                throw error;
            }
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield firebase_1.connectiondb.collection("users").get();
            return snapshot.docs.map((doc) => ({
                data: doc.data(),
                uid: doc.id
            }));
        });
    }
    findById(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield firebase_1.connectiondb.collection("users")
                .where("uid", "==", uid)
                .get();
            return snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    data: data,
                    uid: doc.id
                };
            });
        });
    }
    updatePass(uid, newPass) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield firebase_admin_1.default.auth().updateUser(uid, {
                    password: newPass
                });
                return { message: 'Senha atualizada com sucesso' };
            }
            catch (error) {
                console.error('Erro ao atualizar a senha:', error);
                throw error;
            }
        });
    }
    update(uid, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authUpdates = {};
                if (data.email)
                    authUpdates.email = data.email;
                if (data.password)
                    authUpdates.password = data.password;
                if (data.name)
                    authUpdates.displayName = data.name;
                if (Object.keys(authUpdates).length > 0) {
                    yield firebase_admin_1.default.auth().updateUser(uid, authUpdates);
                }
                const usersRef = firebase_1.connectiondb.collection("users");
                const snapshot = yield usersRef.where("uid", "==", uid).get();
                if (snapshot.empty) {
                    throw new Error(`No user found with UID: ${uid}`);
                }
                const docRef = snapshot.docs[0].ref;
                const firestoreUpdates = {};
                if (data.name)
                    firestoreUpdates.name = data.name;
                if (data.email)
                    firestoreUpdates.email = data.email;
                if (data.phoneNumber)
                    firestoreUpdates.phoneNumber = data.phoneNumber;
                if (data.role)
                    firestoreUpdates.role = data.role;
                yield docRef.update(firestoreUpdates);
                return docRef;
            }
            catch (error) {
                console.error('Error updating user:', error);
                throw error;
            }
        });
    }
    updateRewardStatus(uid, claimCode, newStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usersRef = firebase_1.connectiondb.collection("users");
                const snapshot = yield usersRef.where("uid", "==", uid).get();
                const docRef = snapshot.docs[0].ref;
                const userData = snapshot.docs[0].data();
                const userRewards = userData.rewards || [];
                const reward = userRewards.find((reward) => reward.claimCode === claimCode);
                if (reward) {
                    reward.status = newStatus;
                    yield docRef.update({
                        rewards: userRewards
                    });
                    return { success: true, message: 'Status atualizado com sucesso.' };
                }
                else {
                    throw new Error(`Reward with claimCode ${claimCode} not found.`);
                }
            }
            catch (error) {
                console.error('Error updating reward status:', error);
                throw error;
            }
        });
    }
    block(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield firebase_admin_1.default.auth().updateUser(uid, {
                    disabled: true
                });
                return { message: 'User blocked successfully' };
            }
            catch (error) {
                console.error('Error blocking authority:', error);
                throw error;
            }
        });
    }
}
exports.default = User;
