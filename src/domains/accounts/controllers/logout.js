import { Container } from 'typedi';
import { AccountService } from '../services';
import { SuccessMsgResponse } from '../../../core/api-response';

export const logout = async (req, res) => {
  const logger = Container.get('logger');
  const accountServiceInstance = Container.get(AccountService);

  logger.silly('Calling logout endpoint');

  await accountServiceInstance.logout(req.keystore);

  new SuccessMsgResponse('Logged out').send(res);
};
