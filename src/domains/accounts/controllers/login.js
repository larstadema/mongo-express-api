import { Container } from 'typedi';
import { AccountService } from '../services';
import { setTokenCookie } from '../../../utils/set-token-cookie';
import { SuccessResponse, TooManyRequestsResponse } from '../../../core/api-response';
import { limitSlowBrute, limitConsecutiveFails } from '../../../core/rate-limiters';
import config from '../../../config';
import { RequestError, ErrorType } from '../../../core/api-error';

const limiterSlowBruteByIP = limitSlowBrute('login_fail_ip_per_day');
const limiterConsecutiveFailsByUsernameAndIP = limitConsecutiveFails(
  'login_fail_consecutive_username_and_ip'
);

export const login = async (req, res) => {
  const logger = Container.get('logger');
  const accountServiceInstance = Container.get(AccountService);

  logger.silly('Calling login endpoint');

  const ipAddress = req.ip;

  const usernameAndIP = `${req.body.email}_${ipAddress}`;

  const [resUsernameAndIP, resSlowByIP] = await Promise.all([
    limiterConsecutiveFailsByUsernameAndIP.get(usernameAndIP),
    limiterSlowBruteByIP.get(ipAddress),
  ]);

  let retrySecs = 0;

  // Check if IP or Username + IP is already blocked
  if (
    resSlowByIP !== null &&
    resSlowByIP.consumedPoints > config.rateLimiters.slowBruteMaxAttempts
  ) {
    retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1;
  } else if (
    resUsernameAndIP !== null &&
    resUsernameAndIP.consumedPoints > config.rateLimiters.consecutiveFailAttemps
  ) {
    retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1;
  }

  if (retrySecs > 0) {
    return new TooManyRequestsResponse('Too many requests', `${retrySecs}`).send(res);
  }

  try {
    const { refreshToken, ...data } = await accountServiceInstance.login(req.body, ipAddress);

    logger.silly('Setting refresh token cookie');
    setTokenCookie(res, refreshToken);

    if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > 0) {
      // Reset on successful authorisation
      await limiterConsecutiveFailsByUsernameAndIP.delete(usernameAndIP);
    }

    return new SuccessResponse('success', data).send(res);
  } catch (error) {
    const rlPromises = [];

    // Failed attempt against unknown user
    if (
      error instanceof RequestError &&
      error.name === ErrorType.NOT_FOUND &&
      error.message === 'Email or password is incorrect'
    ) {
      rlPromises.push(limiterSlowBruteByIP.consume(ipAddress));
    }

    // Failed attempt against registered user
    if (error instanceof RequestError && error.name === ErrorType.BAD_REQUEST) {
      rlPromises.push(limiterConsecutiveFailsByUsernameAndIP.consume(usernameAndIP));
    }

    if (rlPromises.length) {
      await Promise.all(rlPromises).catch((rlRejected) => {
        const retryAfter = Math.round(rlRejected.msBeforeNext / 1000);
        throw RequestError.TooManyRequestsError(`${retryAfter}`);
      });
    }

    throw error;
  }
};
