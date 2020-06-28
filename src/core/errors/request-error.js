export const HttpStatusCode = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER: 500,
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
    return new RequestError('BadRequestError', HttpStatusCode.BAD_REQUEST, true, message);
  }

  static UnauthorizedError(message) {
    return new RequestError('UnauthorizedError', HttpStatusCode.UNAUTHORIZED, true, message);
  }

  static ForbiddenError(message) {
    return new RequestError('ForbiddenError', HttpStatusCode.FORBIDDEN, true, message);
  }

  static NotFoundError(message) {
    return new RequestError('NotFoundError', HttpStatusCode.NOT_FOUND, true, message);
  }

  static ConflictError(message) {
    return new RequestError('ConflictError', HttpStatusCode.CONFLICT, true, message);
  }

  static UnprocessableEntityError(message) {
    return new RequestError(
      'UnprocessableEntityError',
      HttpStatusCode.UNPROCESSABLE_ENTITY,
      true,
      message
    );
  }

  static InternalServerError(message) {
    return new RequestError('InternalServerError', HttpStatusCode.INTERNAL_SERVER, true, message);
  }

  getErrorResponse() {
    return {
      message: this.message,
      name: this.name,
      statusCode: this.statusCode,
    };
  }
}
