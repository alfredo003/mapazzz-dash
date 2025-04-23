const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
const helmet = require('helmet')
const flash = require('connect-flash')
const { authenticateUser } = require('./middleware/auth')

const router = require('./routes/index');

const makeAuthenticatedRequest = require('./helpers/AuthReq');
const app = express()
const port = 5000

app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": [
                "'self'", 
                "'unsafe-inline'",
                 "https://www.gstatic.com",
                  "https://apis.google.com",
                   "https://cdn.jsdelivr.net"
                ],
            "frame-src": ["'self'", "https://firebase.google.com"],
            "img-src": [
                "'self'", 
                "data:", 
                "https://res.cloudinary.com", 
                "https://miro.medium.com",
                "https://news.mit.edu/",
                "https://{s}.tile.openstreetmap.org" 
            ],
        }
    }
}))

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(flash())

app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))

app.use(expressLayouts)
app.set('layout', './layouts/full-width')
app.set('view engine', 'ejs')


app.get('/redifinir', authenticateUser, (req, res) => {

    res.render('redif_password', { 
        title: 'Mapazzz - Olá! Bem-Vindo', 
        layout: './layouts/full-width',
        user: {
            email: req.session.userEmail
        },
        error: req.flash('error')
    });
});

app.post('/redifinir', authenticateUser, async (req, res) => {
    const {newPassword,confirmpassword} = req.body;
    if(newPassword !== confirmpassword)
    {
        req.flash('error', "Verifica as Passes!");
        res.redirect('/redifinir');
    }

    try{
        const uid = req.session.userId;
        const data = {newPassword,uid}
        const userData = await makeAuthenticatedRequest(req.session.token,
            'POST', 
            '/usuarios/newpass',
        data
        );
        //req.session.pass = newPassword;
        req.flash('error', "Entra com a nova senha");
        return res.redirect('/login');
    }catch(error)
    {
        req.flash('error', "Erro ao Redifinir a senha!");
        return res.redirect('/redifinir');
    }
    
   
});

app.get('/home', authenticateUser, async (req, res) => {
    try {
        const response = await makeAuthenticatedRequest(req.session.token, 'GET', '/estatisticas');
        const statics = response.statistics;
        
        const result = await makeAuthenticatedRequest(req.session.token, 'GET', '/reportagens');
        const reports = result.reports;

        const pass = req.session.pass;
      
        if(pass === '123456')
        {
            return res.redirect('/redifinir');
        }


        res.render('home', { 
            title: 'Mapazzz - Painel de Controle', 
            layout: './layouts/dashboard',
            user: {
                email: req.session.userEmail
            },
            statics: statics,
            reports: reports
        });
    } catch (error) {
     
        res.render('home', { 
            title: 'Mapazzz - Painel de Controle', 
            layout: './layouts/dashboard',
            user: {
                email: req.session.userEmail
            },
            statics: [],
            reports: []
        });
    }
  
})


app.get('/register', (req, res) => {

    res.render('register_user', { 
        title: 'Mapazzz - Registrar Utilizador', 
        layout: './layouts/dashboard',
        user: {
            email: req.session.userEmail
        },
        messages: {
            success: req.flash('success'),
            error: req.flash('error')
        }
    });
});

app.post('/register', async(req, res) => {

    try {
        const { name, email, phoneNumber,role} = req.body;
        const password = "123456"
        const authorityData = { name, email, phoneNumber, password, role };
        await makeAuthenticatedRequest(req.session.token, 'POST', '/usuarios', authorityData);
        
        req.flash('success', 'Utilizador cadastrado com sucesso!');
        res.redirect('/register');
    } catch (error) {
        console.error('Error creating Utilizador:', error);
        req.flash('error', 'Erro ao cadastrar Utilizador. Por favor, verifique o formulário.');
        res.redirect('/register');
    }
});


app.use('/', router);

app.listen(port, () => console.info(`App listening on port ${port}`))