import * as admin from 'firebase-admin';
import * as firebase from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import express from 'express';

const firebaseConfig = {
  apiKey: "seu-api-key",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "seu-messaging-sender-id",
  appId: "seu-app-id"
};

// Inicializa o app do Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Configuração do Firebase Admin (servidor)
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "seu-projeto",
    clientEmail: "firebase-adminsdk-xxx@seu-projeto.iam.gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\nSua chave privada...\n-----END PRIVATE KEY-----\n"
  }),
  databaseURL: "https://seu-projeto.firebaseio.com"
});

const app = express();
app.use(express.json());

// Rota para criar um novo usuário e enviar email de verificação
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // 1. Criar o usuário no Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // 2. Enviar o email de verificação
    await sendEmailVerification(user);
    
    // 3. Opcional: Salvar dados adicionais no Firestore
    await admin.firestore().collection('users').doc(user.uid).set({
      email: email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      emailVerified: false
    });
    
    res.status(201).json({
      message: "Usuário criado com sucesso. E-mail de verificação enviado.",
      userId: user.uid
    });
  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(400).json({
      error: error.message
    });
  }
});

// Opcional: Rota para reenviar o email de verificação
app.post('/resend-verification', async (req, res) => {
  const { userId } = req.body;
  
  try {
    const user = await admin.auth().getUser(userId);
    
    if (user.emailVerified) {
      return res.status(400).json({ message: "Email já verificado." });
    }
    
    // Usando o Firebase Admin para reenviar o email
    const customToken = await admin.auth().createCustomToken(userId);
    
    // Aqui, você precisará fazer o sign-in com o token customizado no lado do cliente
    // Este é um exemplo simplificado, mas não é recomendado para produção
    // Idealmente, isso deveria ser feito pelo front-end
    
    await sendEmailVerification(auth.currentUser);
    
    res.status(200).json({ message: "Email de verificação reenviado com sucesso." });
  } catch (error) {
    console.error('Erro ao reenviar email:', error);
    res.status(400).json({
      error: error.message
    });
  }
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
