const  {Router}  = require("express");


const awardRouter = Router();

awardRouter.get('/', (req, res) => {
    
    res.render('award', { 
        title: 'Premiações', 
        layout: './layouts/dashboard',
        user: {
            email: req.session.userEmail
        }
    });
})

module.exports = awardRouter;