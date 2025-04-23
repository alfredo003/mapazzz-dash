import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const serviceAccount = require('./mapazzzkey.json');

if (!admin.apps.length) {
  const adm = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const connectiondb = admin.firestore();


export { connectiondb };