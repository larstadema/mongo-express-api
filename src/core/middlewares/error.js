import { isCelebrateError } from 'celebrate';
import { ErrorHandler } from '../api-error-handler';
import { ErrorType, RequestError } from '../api-error';
import {
  AuthFailureResponse,
  AccessTokenErrorResponse,
  NotFoundResponse,
  BadRequestResponse,
  ForbiddenResponse,
  InternalErrorResponse,
  ConflictResponse,
  UnprocessableEntityResponse,
  TooManyRequestsResponse,
} from '../api-response';

const mapRequestContext = (request) => ({
  originalUrl: request.originalUrl,
  protocol: request.protocol,
  requestHeaders: request.headers,
  requestMethod: request.method,
});

// No need for crypto as this is just used for logging ids
const randomString = (length) => Math.round(36 ** length + 1 - Math.random() * 36 ** length).toString(36);

const generateErrorId = () => {
  const ts = Date.now();
  // In the unlikely situation the randomString gives back less then 4 characters, append 4 zeroes and pick last 4 chars
  const rand = `0000'${randomString(4)}`.substr(-4, 4);
  return `E${ts}R${rand}`;
};

// eslint-disable-next-line no-unused-vars
export const errorMiddleware = async (error, req, res, next) => {
  let requestError = error;

  if (isCelebrateError(error)) {
    const message = error.joi.details.map((i) => i.message).join(',');
    requestError = RequestError.UnprocessableEntityError(message);
  }

  if (!ErrorHandler.isTrustedError(error)) {
    requestError = RequestError.InternalServerError(error.message);
  }

  let errorId;
  if (requestError.statusCode >= 500) {
    errorId = generateErrorId();
  }

  await ErrorHandler.handleError(requestError, mapRequestContext(req), errorId);

  switch (requestError.name) {
    case ErrorType.BAD_REQUEST:
      return new BadRequestResponse(requestError.message).send(res);
    case ErrorType.UNAUTHORIZED:
      return new AuthFailureResponse(requestError.message).send(res);
    case ErrorType.TOKEN_EXPIRED:
      return new AccessTokenErrorResponse(requestError.message).send(res);
    case ErrorType.FORBIDDEN:
      return new ForbiddenResponse(requestError.message).send(res);
    case ErrorType.NOT_FOUND:
      return new NotFoundResponse(requestError.message, req.originalUrl).send(res);
    case ErrorType.CONFLICT:
      return new ConflictResponse(requestError.message).send(res);
    case ErrorType.UNPROCESSABLE_ENTITY:
      return new UnprocessableEntityResponse(requestError.message).send(res);
    case ErrorType.TOO_MANY_REQUESTS:
      return new TooManyRequestsResponse('Too many requests', requestError.message).send(res);
    default: {
      let { message } = requestError;

      if (process.env.NODE_ENV === 'production') {
        message = 'Something unexpected happened';
      }

      return new InternalErrorResponse(message, errorId).send(res);
    }
  }
};
