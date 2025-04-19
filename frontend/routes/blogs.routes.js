const  {Router}  = require("express");
const makeAuthenticatedRequest  = require('../helpers/AuthReq');
const { getInstitutionIcon, formatInstitutionType } = require('../helpers/viewHelpers')

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

blogsRouter.post('/', async (req, res) => {
    try {
        const { title, content, imgUrl } = req.body;
        
        const blogData = { title, content, imgUrl };
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