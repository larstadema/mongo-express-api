import { RequestError } from '../api-error';

export const notFoundMiddleware = (req, res, next) => {
  const error = RequestError.NotFoundError('Invalid route');
  next(error);
};
