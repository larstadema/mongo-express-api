import config from '../config';

export const setTokenCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    maxAge: config.tokens.refreshToken.expiresInMs,
  };

  res.cookie('refreshToken', token, cookieOptions);
};
