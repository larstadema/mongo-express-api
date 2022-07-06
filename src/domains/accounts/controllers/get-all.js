import { Container } from 'typedi';
import { SuccessResponse } from '../../../core/api-response';

export const getAll = async (req, res) => {
  const logger = Container.get('logger');
  const accountServiceInstance = Container.get('AccountService');

  logger.silly('Calling getAll endpoint');

  const users = await accountServiceInstance.getAll(req.query);

  new SuccessResponse('success', users).send(res);
};
