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
class Report {
    find() {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield firebase_1.connectiondb.collection("reports")
                .get();
            return snapshot.docs.map((doc) => {
                const data = doc.data();
                return Object.assign(Object.assign({}, data), { uid: doc.id });
            });
        });
    }
    findByStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield firebase_1.connectiondb.collection("reports")
                .where("status", "==", status)
                .get();
            return snapshot.docs.map((doc) => {
                const data = doc.data();
                return Object.assign(Object.assign({}, data), { uid: doc.id });
            });
        });
    }
    findById(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield firebase_1.connectiondb.collection("reports")
                .doc(uid)
                .get()
                .then(snapshot => snapshot.data());
            return snapshot;
        });
    }
    findAllZonas() {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield firebase_1.connectiondb.collection("zones")
                .get();
            return snapshot.docs.map((doc) => {
                const data = doc.data();
                return Object.assign(Object.assign({}, data), { uid: doc.id });
            });
        });
    }
    findZones() {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield firebase_1.connectiondb.collection("zones")
                .get();
            return snapshot.docs.map((doc) => {
                const data = doc.data();
                return { zones: data.zones };
            });
        });
    }
    findByRisk(level) {
        return __awaiter(this, void 0, void 0, function* () {
            let levelName = 0;
            if (level == "low") {
                levelName = 1;
            }
            else if (level == "medium") {
                levelName = 2;
            }
            else if (level == "high") {
                levelName = 3;
            }
            const snapshot = yield firebase_1.connectiondb.collection("reports")
                .where("riskLevel", "==", levelName)
                .get();
            return snapshot.docs.map((doc) => {
                const data = doc.data();
                return Object.assign(Object.assign({}, data), { uid: doc.id });
            });
        });
    }
}
exports.default = Report;
