"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const admin = __importStar(require("firebase-admin"));
class Notification {
    constructor(title, message, token) {
        this.title = title || "";
        this.message = message || "";
        this.token = token || "";
    }
    create(notification) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const docRef = yield firebase_1.connectiondb.collection("notifications").add(notification);
                return docRef;
            }
            catch (error) {
                console.error('Error creating notification:', error);
                throw error;
            }
        });
    }
    getFCMToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield firebase_1.connectiondb.collection("fcm").get();
            return snapshot.docs.map((doc) => (Object.assign({}, doc.data())));
        });
    }
    sendPush() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = {
                    notification: {
                        title: this.title,
                        body: this.message,
                    },
                    token: this.token
                };
                const response = yield admin.messaging().send(data);
                return response;
            }
            catch (error) {
                console.error('Error sending notification:', error);
                throw error;
            }
        });
    }
    find() {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield firebase_1.connectiondb.collection("notifications").get();
            return snapshot.docs.map((doc) => (Object.assign(Object.assign({}, doc.data()), { uid: doc.id })));
        });
    }
    findById(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield firebase_1.connectiondb.collection("notifications")
                .doc(uid)
                .get();
            return snapshot.exists ? Object.assign(Object.assign({}, snapshot.data()), { uid: snapshot.id }) : null;
        });
    }
}
exports.default = Notification;
