import {Router} from 'express'
import reportRouter from './report.routes';

const routes = Router();

routes.use('/reportagens',reportRouter);


export default routes;