import { Container } from 'typedi';
import { SuccessMsgResponse } from '../../../core/api-response';

export const resetPassword = async (req, res) => {
  const logger = Container.get('logger');
  const accountServiceInstance = Container.get('AccountService');

  logger.silly('Calling resetPassword endpoint');

  await accountServiceInstance.resetPassword(req.body);

  new SuccessMsgResponse('Password reset successful').send(res);
};
