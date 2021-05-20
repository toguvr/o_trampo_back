import roomRouter from '@modules/room/routes/room.routes';
import { Router } from 'express';

const routes = Router();

routes.use('/sala', roomRouter);

export default routes;
