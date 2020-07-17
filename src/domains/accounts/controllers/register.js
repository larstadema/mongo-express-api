import { Container } from 'typedi';
import { AccountService } from '../services';
import { SuccessMsgResponse } from '../../../core/api-response';

export const register = async (req, res) => {
  const logger = Container.get('logger');
  const accountServiceInstance = Container.get(AccountService);

  logger.silly('Calling register endpoint');

  const origin = req.get('origin');

  await accountServiceInstance.register(req.body, origin);

  new SuccessMsgResponse('Registration successful, check your email for verification').send(res);
};
