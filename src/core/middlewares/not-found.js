import { RequestError } from '../api-error';

export const notFoundMiddleware = (req, res, next) => {
  const error = new RequestError.NotFoundError('Invalid route');
  next(error);
};
