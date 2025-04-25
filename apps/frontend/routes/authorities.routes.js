const express = require('express');
const authoritiesRoutes = express.Router();
const makeAuthenticatedRequest  = require('../helpers/AuthReq');
const { getInstitutionIcon, formatInstitutionType } = require('../helpers/viewHelpers');
const auth = require('./../config/firebase-config');

authoritiesRoutes.get('/', async (req, res) => {
    try {
        const response = await makeAuthenticatedRequest(req.session.token, 'GET', '/autoridades');
        const institutions = response.authorities;
        
        res.render('authorities', { 
            title: 'MapaZZZ - Instituições', 
            layout: './layouts/dashboard',
            user: {
                email: req.session.userEmail
            },
            institutions: institutions,
            getInstitutionIcon,
            formatInstitutionType,
            messages: {
                success: req.flash('success'),
                error: req.flash('error')
            }
        });
    } catch (error) {
        console.error('Error fetching institutions:', error);
     
        res.render('authorities', { 
            title: 'Instituições', 
            layout: './layouts/dashboard',
            user: {
                email: req.session.userEmail
            },
            institutions: [],
            getInstitutionIcon,
            formatInstitutionType,
            messages: {
                success: req.flash('success'),
                error: req.flash('error')
            }
        });
    }
 }); 
 
authoritiesRoutes.post('/', async (req, res) => {
     try {
         const { name,email, type, address, contact, location } = req.body;
         
         const authorityData = { name, email, type, address, contact, location };
        const result = await makeAuthenticatedRequest(req.session.token, 'POST', '/autoridades', authorityData);
        const user =result.user;

     
         req.flash('success', 'Instituição cadastrada com sucesso!');
         res.redirect('/instituicoes');
     } catch (error) {
         console.error('Error creating institution:', error);
         req.flash('error', 'Erro ao cadastrar instituição. Por favor, verifique o formulário.');
         res.redirect('/instituicoes');
     }
 });

 module.exports = authoritiesRoutes;
