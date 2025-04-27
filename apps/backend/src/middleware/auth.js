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
exports.authenticateToken = authenticateToken;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
function authenticateToken(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const jwt = request.headers.authorization;
        if (!jwt) {
            response.status(401).json({ message: "Usuário nao autorizado" });
            return;
        }
        let decodedIdToken;
        try {
            decodedIdToken = yield firebase_admin_1.default.auth().verifyIdToken(jwt, true);
        }
        catch (e) {
            response.status(401).json({ message: "Usuário nao autorizado" });
            return;
        }
        request.user = {
            id: decodedIdToken.sub
        };
        next();
    });
}
