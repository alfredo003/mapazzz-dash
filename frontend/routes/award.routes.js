const  {Router}  = require("express");
const express = require('express');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const storage = multer.memoryStorage();
const makeAuthenticatedRequest = require('../helpers/AuthReq');

const upload = multer({ storage: storage });

const awardRouter = Router();


awardRouter.get('/', async (req, res) => {
    
    try {
        const result = await makeAuthenticatedRequest(req.session.token, 'GET', '/recompensas');
    
         const awards = result.awards;

        res.render('award', { 
            title: 'Mapazzz - Premiações', 
            layout: './layouts/dashboard',
            user: {
                email: req.session.userEmail
            },
            messages: {
                success: req.flash('success'),
                error: req.flash('error')
            },
            awards: awards
        });
    } catch (error) {
       
        res.render('award', { 
            title: 'Mapazzz - Premiações', 
            layout: './layouts/dashboard',
            user: {
                email: req.session.userEmail
            },
            awards: [],
            messages: {
                success: req.flash('success'),
                error: req.flash('error')
            }
        });
    }
})

awardRouter.post('/', upload.single('file'), async (req, res) => {
    try {

        const { title,points } = req.body;
        
        if (!req.file) {
            req.flash('error', 'Por favor, envie uma imagem.');
            return res.redirect('/premiacoes');
        }

        const formData = new FormData();
        formData.append('image', req.file.buffer, req.file.originalname);

        const imageResponse = await axios.post('https://burger-image-api.vercel.app/upload', formData, {
            headers: formData.getHeaders(),
        });

        const photoUrl = imageResponse.data.imageUrl;

        const awardData = {  imageUrl: photoUrl, points, title };
        
        await makeAuthenticatedRequest(req.session.token, 'POST', '/recompensas', awardData);
        
        req.flash('success', 'premiacoes cadastrada com sucesso!');
        res.redirect('/premiacoes');
    } catch (error) {
        console.error('Error creating premiacoes:', error);
        req.flash('error', 'Erro ao cadastrar premiacoes. Por favor, verifique o formulário.');
        res.redirect('/premiacoes');
    }
});

module.exports = awardRouter;