import { Container } from 'typedi';
import { AccountService } from '../services';
import { SuccessMsgResponse } from '../../../core/api-response';

export const resetPassword = async (req, res) => {
  const logger = Container.get('logger');
  const authServiceInstance = Container.get(AccountService);

  logger.silly('Calling resetPassword endpoint');

  await authServiceInstance.resetPassword(req.body);

  new SuccessMsgResponse('Password reset successful').send(res);
};
