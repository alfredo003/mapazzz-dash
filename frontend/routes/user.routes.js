const express = require('express');
const userRoutes = express.Router();


userRoutes.get('/users', async(req, res) => {

    res.render('users', { 
        title: 'Instituições', 
        layout: './layouts/dashboard',
        user: {
            email: req.session.userEmail
        }
    });

});

module.exports = userRoutes;
