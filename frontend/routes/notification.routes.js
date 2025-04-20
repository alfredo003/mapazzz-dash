const express = require('express');
const makeAuthenticatedRequest  = require('../helpers/AuthReq');
const notificationRoutes = express.Router();


notificationRoutes.get('/', async(req, res) => {

    try {
        const response = await makeAuthenticatedRequest(req.session.token, 'GET', '/notificacoes');
        const notifications = response;

        res.render('notifications', { 
            title: 'Mapazzz - Notificações', 
            layout: './layouts/dashboard',
            user: {
            email: req.session.userEmail
        },
        notifications:notifications
        
    });
    } catch (error) {
         res.render('notifications', { 
            title: 'Instituições', 
            layout: './layouts/dashboard',
            user: {
                email: req.session.userEmail
            },
            notifications: [],
            messages: {
                success: req.flash('success'),
                error: req.flash('error')
            }
        });
    }
});

notificationRoutes.post('/', async (req, res) => {
    try {
        const { title,message } = req.body;
        
       /* const Data = { title,message  };
       const restut = await makeAuthenticatedRequest(req.session.token, 'POST', '/notificacoes/send', Data);*/
     
       const restut1 = await makeAuthenticatedRequest(req.session.token, 'GET', '/notificacoes/fcm');
       console.log(restut1.data);

        req.flash('success', 'Notificações enviadas com sucesso!');
        res.redirect('/notifications');
    } catch (error) {
        console.error('Error creating institution:', error);
        req.flash('error', 'Erro ao cadastrar instituição. Por favor, verifique o formulário.');
        res.redirect('/notifications');
    }
});
module.exports = notificationRoutes;
