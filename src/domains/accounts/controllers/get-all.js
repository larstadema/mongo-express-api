import { Container } from 'typedi';
import { AccountService } from '../services';
import { SuccessResponse } from '../../../core/api-response';

export const getAll = async (req, res) => {
  const logger = Container.get('logger');
  const authServiceInstance = Container.get(AccountService);

  logger.silly('Calling getAll endpoint');

  const users = await authServiceInstance.getAll(req.query);

  new SuccessResponse('success', users).send(res);
};
