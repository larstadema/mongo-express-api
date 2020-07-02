import { Container } from 'typedi';
import { AccountService } from '../services';
import { RequestError } from '../../../core/api-error';
import { Roles } from '../../../core/roles';
import { SuccessMsgResponse } from '../../../core/api-response';

export const revokeToken = async (req, res) => {
  const logger = Container.get('logger');
  const authServiceInstance = Container.get(AccountService);

  logger.silly('Calling revokeToken endpoint');

  const token = req.body.token || req.cookies.refreshToken;
  const ipAddress = req.ip;

  if (!token) {
    throw new RequestError.BadRequestError('Token is required');
  }

  if (!req.user.ownsToken(token) && req.user.role !== Roles.Admin) {
    throw new RequestError.UnauthorizedError('Not authorized');
  }

  await authServiceInstance.revokeToken(token, ipAddress);

  new SuccessMsgResponse('Token revoked').send(res);
};
