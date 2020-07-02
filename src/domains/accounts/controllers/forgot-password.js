import { Container } from 'typedi';
import { AccountService } from '../services';
import { SuccessMsgResponse } from '../../../core/api-response';

export const forgotPassword = async (req, res) => {
  const logger = Container.get('logger');
  const authServiceInstance = Container.get(AccountService);

  logger.silly('Calling forgotPassword endpoint');

  const origin = req.get('origin');

  await authServiceInstance.forgotPassword(req.body, origin);

  new SuccessMsgResponse('Password has been reset, check your email for further instructions').send(
    res
  );
};
