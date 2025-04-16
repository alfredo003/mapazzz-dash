import {Router} from 'express'
import reportRouter from './report.routes';
import authorityRouter from './authority.routes';
import blogRouter from './blog.routes';
import userRouter from './user.routes';

const routes = Router();

routes.use('/reportagens',reportRouter);
routes.use('/autoridades',authorityRouter);
routes.use('/blog',blogRouter);
routes.use('/users',userRouter);

export default routes;