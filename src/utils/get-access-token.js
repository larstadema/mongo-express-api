export const getAccessToken = (req) => {
  const token = req.headers.authorization;
  if (token && token.startsWith('Bearer ')) {
    return token.split(' ')[1];
  }

  return null;
};
