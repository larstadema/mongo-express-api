import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { wrapAsync } from '../../../core/middlewares';
import * as authController from '../controllers';

const route = Router();

export const authRoutes = (app) => {
  app.use('/auth', route);

  route.get('/signup', (req, res) => {
    res.json({ ok: true });
  });
  route.post(
    '/signup',
    celebrate({
      body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
      }),
    }),
    wrapAsync(authController.signUp)
  );

  route.post(
    '/signin',
    celebrate({
      body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      }),
    }),
    wrapAsync(authController.signIn)
  );
};
