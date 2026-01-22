export type HttpErrorDetails =
  | Record<string, unknown>
  | Array<Record<string, unknown>>
  | undefined;

export class HttpException extends Error {
  public readonly statusCode: number;
  public readonly error: string;
  public readonly details?: HttpErrorDetails;

  constructor(
    statusCode: number,
    error: string,
    message: string,
    details?: HttpErrorDetails,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestException extends HttpException {
  constructor(message = "Bad Request", details?: HttpErrorDetails) {
    super(400, "BadRequest", message, details);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message = "Unauthorized", details?: HttpErrorDetails) {
    super(401, "Unauthorized", message, details);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message = "Forbidden", details?: HttpErrorDetails) {
    super(403, "Forbidden", message, details);
  }
}

export class NotFoundException extends HttpException {
  constructor(message = "Not Found", details?: HttpErrorDetails) {
    super(404, "NotFound", message, details);
  }
}

export class ConflictException extends HttpException {
  constructor(message = "Conflict", details?: HttpErrorDetails) {
    super(409, "Conflict", message, details);
  }
}

export class UnprocessableEntityException extends HttpException {
  constructor(message = "Unprocessable Entity", details?: HttpErrorDetails) {
    super(422, "UnprocessableEntity", message, details);
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(message = "Internal Server Error", details?: HttpErrorDetails) {
    super(500, "InternalServerError", message, details);
  }
}
