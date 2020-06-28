import { Router } from 'express';
import { authRoutes } from '../domains/auth';
// import user from './routes/user';
import * as middlewares from '../core/middlewares';

export { middlewares };

export default () => {
  const router = Router();
  authRoutes(router);
  // user(router);

  return router;
};
