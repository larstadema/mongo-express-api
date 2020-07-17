import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { wrapAsync } from '../../../core/middlewares';
import * as accountController from '../controllers';
import { authorize } from '../../../core/middlewares/authorize';
import { Roles } from '../../../core/roles';

const route = Router();

export const accountRoutes = (app) => {
  app.use('/accounts', route);

  route.post(
    '/login',
    celebrate({
      [Segments.BODY]: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().max(64).required(),
      }),
    }),
    wrapAsync(accountController.login)
  );

  route.post('/logout', authorize(), wrapAsync(accountController.logout));

  route.post(
    '/register',
    celebrate({
      [Segments.BODY]: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(64).required(),
      }),
    }),
    wrapAsync(accountController.register)
  );

  route.post('/refresh-token', wrapAsync(accountController.refreshToken));

  route.post(
    '/revoke-token',
    authorize(),
    celebrate({
      [Segments.BODY]: Joi.object({
        token: Joi.string().empty(''),
      }),
    }),
    wrapAsync(accountController.revokeToken)
  );

  route.post(
    '/verify-email',
    celebrate({
      [Segments.BODY]: Joi.object({
        token: Joi.string().required(),
      }),
    }),
    wrapAsync(accountController.verifyEmail)
  );

  route.post(
    '/forgot-password',
    celebrate({
      [Segments.BODY]: Joi.object({
        email: Joi.string().email().required(),
      }),
    }),
    wrapAsync(accountController.forgotPassword)
  );

  route.post(
    '/reset-password',
    celebrate({
      [Segments.BODY]: Joi.object({
        token: Joi.string().required(),
        password: Joi.string().min(6).max(64).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
      }),
    }),
    wrapAsync(accountController.resetPassword)
  );

  route.get(
    '/:id',
    authorize(),
    celebrate({
      [Segments.PARAMS]: Joi.object({
        id: Joi.string().required(),
      }),
    }),
    wrapAsync(accountController.getById)
  );

  route.delete(
    '/:id',
    authorize(),
    celebrate({
      [Segments.PARAMS]: Joi.object({
        id: Joi.string().required(),
      }),
    }),
    wrapAsync(accountController.deleteById)
  );

  route.get(
    '/',
    authorize(Roles.Admin),
    celebrate({
      [Segments.QUERY]: Joi.object({
        limit: Joi.number().min(1).max(100).default(50),
        next: Joi.string(),
        previous: Joi.string(),
        sortAscending: Joi.boolean(),
      }),
    }),
    wrapAsync(accountController.getAll)
  );
};
