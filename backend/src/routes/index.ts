import {Router} from 'express'
import reportRouter from './report.routes';
import authorityRouter from './authority.routes';
import blogRouter from './blog.routes';
import userRouter from './user.routes';
import statisticRouter from './statistic.routes';
import { authenticateToken } from '../middleware/auth';

const routes = Router();

routes.use('/reportagens', authenticateToken, reportRouter);
routes.use('/autoridades', authenticateToken, authorityRouter);
routes.use('/blog', authenticateToken, blogRouter);
routes.use('/usuarios', authenticateToken, userRouter);
routes.use('/estatisticas', authenticateToken, statisticRouter);

export default routes;