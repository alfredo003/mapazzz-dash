const  {Router}  = require("express");
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const storage = multer.memoryStorage();
const makeAuthenticatedRequest = require('../helpers/AuthReq');
const { getInstitutionIcon, formatInstitutionType } = require('../helpers/viewHelpers')

const upload = multer({ storage: storage });
const blogsRouter = Router();

blogsRouter.get('/', async(req, res) => {
    try {
        const response = await makeAuthenticatedRequest(req.session.token, 'GET', '/blog');
        
        const blogs = response.blogs;

    res.render('blog', { 
        title: 'MapaZZZ - Blogs', 
        layout: './layouts/dashboard',
        user: {
            email: req.session.userEmail
        },
        blogs: blogs,
        getInstitutionIcon,
        formatInstitutionType,
        messages: {
            success: req.flash('success'),
            error: req.flash('error')
        }
    });

    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.render('blog', { 
            title: 'MapaZZZ - Blogs', 
            layout: './layouts/dashboard',
            blogs: [],
            getInstitutionIcon,
            formatInstitutionType,
            messages: {
                success: req.flash('success'),
                error: req.flash('error')
            }
        });
    }
}); 

blogsRouter.post('/', upload.single('file'),async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!req.file) {
            req.flash('error', 'Por favor, envie uma imagem.');
            return res.redirect('/premiacoes');
        }

        const formData = new FormData();
        formData.append('image', req.file.buffer, req.file.originalname);

        const imageResponse = await axios.post('https://burger-image-api.vercel.app/upload', formData, {
            headers: formData.getHeaders(),
        });

        console.log(imageResponse);

        const photoUrl = imageResponse.data.imageUrl;

        const blogData = { title, content, imageUrl: photoUrl };
        await makeAuthenticatedRequest(req.session.token, 'POST', '/blog', blogData);
        
        req.flash('success', 'Conteudo adicionado com sucesso!');
        res.redirect('/blog');
    } catch (error) {
        console.error('Error creating blog:', error);
        req.flash('error', 'Erro ao adicionar conteudo. Por favor, verifique o formulário.');
        res.redirect('/blog');
    }
})

module.exports = blogsRouter;