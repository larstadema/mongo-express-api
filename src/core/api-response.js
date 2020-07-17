const StatusCode = {
  SUCCESS: '10000',
  FAILURE: '10001',
  RETRY: '10002',
  INVALID_ACCESS_TOKEN: '10003',
};

export const HttpStatusCode = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER: 500,
};

class ApiResponse {
  constructor(statusCode, httpStatusCode, message) {
    this.statusCode = statusCode;
    this.status = httpStatusCode;
    this.message = message;
  }

  prepare(response, data) {
    return response.status(this.status).json(ApiResponse.parse(data));
  }

  send(response) {
    return this.prepare(response, this);
  }

  static parse(response) {
    const result = { ...response };

    // Remove undefined values and status key
    Object.keys(result).forEach((key) => {
      if (result[key] === undefined || key === 'status') {
        delete result[key];
      }
    });

    return result;
  }
}

export class AuthFailureResponse extends ApiResponse {
  constructor(message = 'Invalid authentication') {
    super(StatusCode.FAILURE, HttpStatusCode.UNAUTHORIZED, message);
  }
}

export class BadRequestResponse extends ApiResponse {
  constructor(message = 'Bad request') {
    super(StatusCode.FAILURE, HttpStatusCode.BAD_REQUEST, message);
  }
}

export class ConflictResponse extends ApiResponse {
  constructor(message = 'Conflict') {
    super(StatusCode.FAILURE, HttpStatusCode.CONFLICT, message);
  }
}

export class NotFoundResponse extends ApiResponse {
  constructor(message = 'Not Found', url) {
    super(StatusCode.FAILURE, HttpStatusCode.NOT_FOUND, message);
    this.url = url;
  }

  send(response) {
    return super.prepare(response, this);
  }
}

export class ForbiddenResponse extends ApiResponse {
  constructor(message = 'Forbidden') {
    super(StatusCode.FAILURE, HttpStatusCode.FORBIDDEN, message);
  }
}

export class InternalErrorResponse extends ApiResponse {
  constructor(message = 'Internal server', errorId) {
    super(StatusCode.FAILURE, HttpStatusCode.INTERNAL_ERROR, message);
    this.errorId = errorId;
  }
}

export class UnprocessableEntityResponse extends ApiResponse {
  constructor(message = 'Unprocessable entity') {
    super(StatusCode.FAILURE, HttpStatusCode.UNPROCESSABLE_ENTITY, message);
  }
}

export class TooManyRequestsResponse extends ApiResponse {
  constructor(message = 'Too many requests', retryAfter) {
    super(StatusCode.FAILURE, HttpStatusCode.TOO_MANY_REQUESTS, message);
    this.retryAfter = retryAfter;
  }

  send(response) {
    response.setHeader('Retry-After', this.retryAfter);
    return super.prepare(response, this);
  }
}

export class SuccessMsgResponse extends ApiResponse {
  constructor(message) {
    super(StatusCode.SUCCESS, HttpStatusCode.OK, message);
  }
}

export class FailureMsgResponse extends ApiResponse {
  constructor(message) {
    super(StatusCode.FAILURE, HttpStatusCode.OK, message);
  }
}

export class SuccessResponse extends ApiResponse {
  constructor(message, data) {
    super(StatusCode.SUCCESS, HttpStatusCode.OK, message);
    this.data = data;
  }

  send(response) {
    return super.prepare(response, this);
  }
}

export class AccessTokenErrorResponse extends ApiResponse {
  constructor(message = 'Access token invalid') {
    super(StatusCode.INVALID_ACCESS_TOKEN, HttpStatusCode.UNAUTHORIZED, message);
    this.instruction = 'refresh_token';
  }

  send(response) {
    response.setHeader('instruction', this.instruction);
    return super.prepare(response, this);
  }
}
