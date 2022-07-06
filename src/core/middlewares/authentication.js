import { Container } from 'typedi';
import { RequestError } from '../api-error';
import { JWT } from '../jwt';
import { getAccessToken } from '../../utils/get-access-token';
import { getRequestOrigin } from '../../utils/get-request-origin';

export const authentication = async (req, res, next) => {
  const userRepo = Container.get('userRepo');
  const keystoreRepo = Container.get('keystoreRepo');

  const country = getRequestOrigin(req);
  const accessToken = getAccessToken(req);

  if (!accessToken) {
    return next(RequestError.UnauthorizedError('Not logged in'));
  }

  let payload;
  try {
    payload = await JWT.validate(accessToken);
  } catch (error) {
    return next(error);
  }

  const user = await userRepo.findById(payload.sub);

  if (!user) {
    return next(RequestError.UnauthorizedError('User not registered'));
  }

  req.user = user;
  req.country = country;

  const keystore = await keystoreRepo.GetByAccountIdAndAccessKey(user.id, payload.atk);

  if (!keystore) {
    return next(RequestError.UnauthorizedError('Invalid access token'));
  }

  req.keystore = keystore;

  return next();
};
