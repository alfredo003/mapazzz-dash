import {Router} from 'express'
import reportRouter from './report.routes';
import authorityRouter from './authority.routes';
import blogRouter from './blog.routes';
import userRouter from './user.routes';
import statisticRouter from './statistic.routes';
import notificationRoutes from './notification.routes';
import { authenticateToken } from '../middleware/auth';
import awardRouter from './award.routes';

const routes = Router();
 
routes.use('/reportagens', reportRouter);
routes.use('/autoridades', authorityRouter);
routes.use('/blog',authenticateToken, blogRouter);
routes.use('/usuarios',authenticateToken, userRouter);
routes.use('/estatisticas', statisticRouter);
routes.use('/recompensas', awardRouter);
routes.use('/notificacoes',authenticateToken,notificationRoutes);
 
export default routes;