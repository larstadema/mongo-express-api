import { Container } from 'typedi';
import { AccountService } from '../services';
import { SuccessMsgResponse } from '../../../core/api-response';

export const verifyEmail = async (req, res) => {
  const logger = Container.get('logger');
  const accountServiceInstance = Container.get(AccountService);

  logger.silly('Calling verifyEmail endpoint');

  await accountServiceInstance.verifyEmail(req.body);

  new SuccessMsgResponse('Verification successful, login enabled').send(res);
};
