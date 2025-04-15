import * as admin from 'firebase-admin';
import dotenv from 'dotenv';
import { ServiceAccount } from 'firebase-admin';
dotenv.config();

const serviceAccount = require('./mapazzzkey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const connectiondb = admin.firestore();

export { connectiondb };