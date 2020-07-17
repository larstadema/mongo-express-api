import { Container } from 'typedi';
import { authentication } from './authentication';
import { RequestError } from '../api-error';

export const authorize = (roles = []) => {
  // Support setting roles as string and array. (Role.User or 'User')
  let rolesArray = roles;
  if (typeof roles === 'string') {
    rolesArray = [roles];
  }

  return [
    authentication,
    async (req, res, next) => {
      const keystoreRepo = Container.get('keystoreRepo');
      const refreshTokens = (await keystoreRepo.getTokensByAccountId(req.user.id)) || [];

      const validRoles = req.user.roles.filter((role) => rolesArray.includes(role));

      if (rolesArray.length && (!validRoles || !validRoles.length)) {
        return next(RequestError.UnauthorizedError('Permission denied'));
      }

      req.user.ownsToken = (token) => refreshTokens.some((r) => r === token);

      return next();
    },
  ];
};
