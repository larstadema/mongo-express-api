import { Container } from 'typedi';
import { AccountService } from '../services';
import { RequestError } from '../../../core/api-error';
import { Roles } from '../../../core/roles';
import { SuccessMsgResponse } from '../../../core/api-response';

export const revokeToken = async (req, res) => {
  const logger = Container.get('logger');
  const accountServiceInstance = Container.get(AccountService);

  logger.silly('Calling revokeToken endpoint');

  const token = req.body.token || req.cookies.refreshToken;
  const ipAddress = req.ip;

  if (!token) {
    throw RequestError.BadRequestError('Token is required');
  }

  const isAdmin = req.user.roles.some((role) => role === Roles.Admin);

  if (!req.user.ownsToken(token) && !isAdmin) {
    throw RequestError.UnauthorizedError('Not authorized');
  }

  await accountServiceInstance.revokeToken(token, ipAddress);

  new SuccessMsgResponse('Token revoked').send(res);
};
