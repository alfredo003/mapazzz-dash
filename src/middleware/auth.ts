import { Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import { CustomRequest } from '../types/express';

export async function authenticateToken(request: CustomRequest, response: Response, next: NextFunction) {
    const jwt = request.headers.authorization;
    if (!jwt) {
        response.status(401).json({message: "Usuário nao autorizado"});
        return;
    }

    let decodedIdToken;
    try {
        decodedIdToken = await admin.auth().verifyIdToken(jwt, true);
    } catch (e) {
        response.status(401).json({message: "Usuário nao autorizado"});
        return;
    }

    request.user = {
        id: decodedIdToken.sub
    }

    next();
}