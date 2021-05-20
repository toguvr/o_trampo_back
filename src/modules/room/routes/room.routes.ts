import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

import SalaController from '../controllers/SalaController';

const roomRouter = Router();
const roomController = new SalaController();

roomRouter.get('/:sala_id', roomController.index);

roomRouter.post(
  '/',
  // celebrate({
  //   [Segments.BODY]: {
  //     isPrivate: Joi.boolean(),
  //     password: Joi.optional(),
  //   },
  // }),
  roomController.create,
);

roomRouter.post('/iniciar', roomController.start);

export default roomRouter;
