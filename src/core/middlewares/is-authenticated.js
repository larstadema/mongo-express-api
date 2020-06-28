import jwt from 'express-jwt';
import config from '../../config';

const getToken = (req) => {
  let token = req.headers.authorization;
  if (token.startsWith('Bearer ')) {
    // Remove "Bearer " from string
    token = token.slice(7, token.length);
  }

  if (token) {
    return token;
  }

  return null;
};

export const isAuthenticated = jwt({
  secret: config.jwtSecret,
  userProperty: 'token',
  getToken,
});
