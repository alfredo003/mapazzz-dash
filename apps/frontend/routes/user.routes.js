const express = require('express');
const makeAuthenticatedRequest  = require('../helpers/AuthReq');
const userRoutes = express.Router();




userRoutes.get('/', async(req, res) => {
    try {
        const response = await makeAuthenticatedRequest(req.session.token, 'GET', '/usuarios');
        const users = response.users;
     
        res.render('users', { 
            title: 'MapaZZZ - Configurações', 
            layout: './layouts/dashboard',
            user: {
                email: req.session.userEmail
            },
            users: users,
            messages: {
                success: req.flash('success'),
                error: req.flash('error')
            }
        });
    } catch (error) {
        console.error('Error fetching institutions:', error);
     
        res.render('users', { 
            title: 'MapaZZZ - Configurações', 
            layout: './layouts/dashboard',
            user: {
                email: req.session.userEmail
            },
            users: [],
            messages: {
                success: req.flash('success'),
                error: req.flash('error')
            }
        });
    }

}); 
 


module.exports = userRoutes;
