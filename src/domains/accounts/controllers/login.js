import { Container } from 'typedi';
import { AccountService } from '../services';
import { setTokenCookie } from '../../../utils/set-token-cookie';
import { SuccessResponse } from '../../../core/api-response';

export const login = async (req, res) => {
  const logger = Container.get('logger');
  const authServiceInstance = Container.get(AccountService);

  logger.silly('Calling login endpoint');

  const ipAddress = req.ip;

  const { refreshToken, ...data } = await authServiceInstance.login(req.body, ipAddress);

  logger.silly('Setting refresh token cookie');
  setTokenCookie(res, refreshToken);

  new SuccessResponse('success', data).send(res);
};
