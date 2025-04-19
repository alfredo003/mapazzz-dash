const { Router } = require('express');
const awardRouter = require('./award.routes');
const blogsRouter = require('./blogs.routes');
const authRouter = require('./auth.routes');
const reportsRouter = require('./reports.routes');
const authoritiesRouter = require('./authorities.routes');
const userRouter = require('./user.routes');
const { authenticateUser } = require('../middleware/auth');

const router = Router();

router.use('/', authRouter);

router.use('/premiacoes', authenticateUser, awardRouter);
router.use('/blog', authenticateUser, blogsRouter);
router.use('/reportagens', authenticateUser, reportsRouter);
router.use('/instituicoes', authenticateUser, authoritiesRouter);
router.use('/users', authenticateUser, userRouter);

module.exports = router;

