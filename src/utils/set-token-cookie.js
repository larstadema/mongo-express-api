import config from '../config';

export const setTokenCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + config.refreshTokenExpiration),
  };

  res.cookie('refreshToken', token, cookieOptions);
};
