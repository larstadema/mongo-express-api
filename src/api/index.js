import { Router } from 'express';
import { accountRoutes } from '../domains/accounts';
import * as middlewares from '../core/middlewares';

export { middlewares };

export default () => {
  const router = Router();
  accountRoutes(router);

  return router;
};
