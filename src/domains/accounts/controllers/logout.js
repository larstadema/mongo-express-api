import { Container } from 'typedi';
import { AccountService } from '../services';
import { SuccessMsgResponse } from '../../../core/api-response';

export const logout = async (req, res) => {
  const logger = Container.get('logger');
  const authServiceInstance = Container.get(AccountService);

  logger.silly('Calling logout endpoint');

  await authServiceInstance.logout(req.keystore);

  new SuccessMsgResponse('Logged out').send(res);
};
