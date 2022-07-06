import { Container } from 'typedi';
import { setTokenCookie } from '../../../utils/set-token-cookie';
import { RequestError } from '../../../core/api-error';
import { getAccessToken } from '../../../utils/get-access-token';
import { JWT } from '../../../core/jwt';
import { SuccessResponse } from '../../../core/api-response';

export const refreshToken = async (req, res) => {
  const logger = Container.get('logger');
  const accountServiceInstance = Container.get('AccountService');

  logger.silly('Calling refreshToken endpoint');

  const { refreshToken: oldRefreshToken } = req.cookies;
  const ipAddress = req.ip;
  const accessToken = getAccessToken(req);

  if (!accessToken) {
    throw RequestError.UnauthorizedError('Not logged in');
  }

  if (!oldRefreshToken) {
    throw RequestError.BadRequestError('Missing refresh token cookie');
  }

  const payload = await JWT.decode(accessToken);

  const { refreshToken: newRefreshToken, token } = await accountServiceInstance.refreshToken(
    payload.sub,
    oldRefreshToken,
    payload.atk,
    ipAddress
  );

  logger.silly('Setting new refresh token cookie');
  setTokenCookie(res, newRefreshToken);

  new SuccessResponse('success', token).send(res);
};
