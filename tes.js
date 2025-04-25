import * as admin from 'firebase-admin';

admin.initializeApp();

async function createUserAndSendVerificationEmail(data: { email: string, password: string, name: string }) {
    try {
      
        const userRecord = await admin.auth().createUser({
            email: data.email,
            password: data.password,
            displayName: data.name
        });

        
        const verificationLink = await admin.auth().generateEmailVerificationLink(data.email);
        
        // Agora você pode enviar o link de verificação por e-mail para o usuário.
        // Para enviar o e-mail, você pode usar um serviço de e-mail (por exemplo, nodemailer ou outro serviço de e-mail de sua escolha)

        // Exemplo usando Nodemailer (ou você pode usar outro serviço de envio de e-mail)
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
            service: 'gmail', // ou outro serviço de e-mail
            auth: {
                user: 'seuemail@gmail.com',
                pass: 'sua_senha_de_email'
            }
        });

        // Preparar e-mail
        const mailOptions = {
            from: 'seuemail@gmail.com',
            to: data.email,
            subject: 'Verifique seu E-mail',
            text: `Clique no link abaixo para verificar seu e-mail:\n\n${verificationLink}`
        };

        // Enviar o e-mail
        await transporter.sendMail(mailOptions);
        console.log('E-mail de verificação enviado com sucesso!');
        
        // Retornar a resposta (ou outras operações, como salvar no Firestore)
        return userRecord;

    } catch (error) {
        console.error('Erro ao criar usuário ou enviar e-mail de verificação:', error);
        throw error;
    }
}
