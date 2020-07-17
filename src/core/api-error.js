import { HttpStatusCode } from './api-response';

export const ErrorType = {
  BAD_REQUEST: 'BadRequestError',
  UNAUTHORIZED: 'UnauthorizedError',
  TOKEN_EXPIRED: 'TokenExpiredError',
  FORBIDDEN: 'ForbiddenError',
  NOT_FOUND: 'NotFoundError',
  CONFLICT: 'ConflictError',
  UNPROCESSABLE_ENTITY: 'UnprocessableEntityError',
  TOO_MANY_REQUESTS: 'TooManyRequestsError',
  INTERNAL_SERVER: 'InternalServerError',
};

export class RequestError extends Error {
  constructor(name, statusCode, isOperational, description) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }

  static BadRequestError(message) {
    return new RequestError(ErrorType.BAD_REQUEST, HttpStatusCode.BAD_REQUEST, true, message);
  }

  static UnauthorizedError(message) {
    return new RequestError(ErrorType.UNAUTHORIZED, HttpStatusCode.UNAUTHORIZED, true, message);
  }

  static TokenExpiredError() {
    return new RequestError(
      ErrorType.TOKEN_EXPIRED,
      HttpStatusCode.UNAUTHORIZED,
      true,
      'Token is expired'
    );
  }

  static ForbiddenError(message) {
    return new RequestError(ErrorType.FORBIDDEN, HttpStatusCode.FORBIDDEN, true, message);
  }

  static NotFoundError(message) {
    return new RequestError(ErrorType.NOT_FOUND, HttpStatusCode.NOT_FOUND, true, message);
  }

  static ConflictError(message) {
    return new RequestError(ErrorType.CONFLICT, HttpStatusCode.CONFLICT, true, message);
  }

  static UnprocessableEntityError(message) {
    return new RequestError(
      ErrorType.UNPROCESSABLE_ENTITY,
      HttpStatusCode.UNPROCESSABLE_ENTITY,
      true,
      message
    );
  }

  static TooManyRequestsError(message) {
    return new RequestError(
      ErrorType.TOO_MANY_REQUESTS,
      HttpStatusCode.TOO_MANY_REQUESTS,
      true,
      message
    );
  }

  static InternalServerError(message) {
    return new RequestError(
      ErrorType.INTERNAL_SERVER,
      HttpStatusCode.INTERNAL_SERVER,
      true,
      message
    );
  }
}
