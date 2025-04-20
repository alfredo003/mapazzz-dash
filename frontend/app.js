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
            "script-src": ["'self'", "'unsafe-inline'", "https://www.gstatic.com", "https://apis.google.com"],
            "frame-src": ["'self'", "https://firebase.google.com"],
            "img-src": ["'self'", "data:", "https://res.cloudinary.com"]
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


app.get('/home', authenticateUser, async (req, res) => {
    try {
        const response = await makeAuthenticatedRequest(req.session.token, 'GET', '/estatisticas');
        const statics = response.statistics;
        
        const result = await makeAuthenticatedRequest(req.session.token, 'GET', '/reportagens');
        const reports = result.reports;

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
       // console.error('Error fetching institutions:', error);
     
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

app.use('/', router);

app.listen(port, () => console.info(`App listening on port ${port}`))