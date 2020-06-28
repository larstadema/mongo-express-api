import { isCelebrate } from 'celebrate';
import { ErrorHandler, RequestError } from '../errors';

const mapRequestContext = (request) => ({
  originalUrl: request.originalUrl,
  protocol: request.protocol,
  requestHeaders: request.headers,
  requestMethod: request.method,
});

// No need for crypto as this is just used for logging ids
const randomString = (length) => {
  return Math.round(36 ** length + 1 - Math.random() * 36 ** length).toString(36);
};

const generateErrorId = () => {
  const ts = Date.now();
  // In the unlikely situation the randomString gives back less then 4 characters, append 4 zeroes and pick last 4 chars
  const rand = `0000'${randomString(4)}`.substr(-4, 4);
  return `E${ts}R${rand}`;
};

// eslint-disable-next-line no-unused-vars
export const errorMiddleware = async (error, req, res, next) => {
  let requestError = error;

  if (isCelebrate(error)) {
    const message = error.joi.details.map((i) => i.message).join(',');
    requestError = new RequestError.UnprocessableEntityError(message);
  }

  const isTrustedError = ErrorHandler.isTrustedError(requestError);

  if (!isTrustedError) {
    requestError = new RequestError.InternalServerError('Unknown application error');
  }

  const errorResponse = requestError.getErrorResponse();

  if (requestError.statusCode >= 500) {
    errorResponse.errorCode = generateErrorId();
  }

  await ErrorHandler.handleError(requestError, mapRequestContext(req), errorResponse.errorCode);

  if (process.env.NODE_ENV !== 'production') {
    errorResponse.stack = requestError.stack;
  }

  res.status(requestError.statusCode);

  res.json(errorResponse);
};
