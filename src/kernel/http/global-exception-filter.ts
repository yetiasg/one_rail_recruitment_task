import type { NextFunction, Request, Response } from "express";
import {
  HttpException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  HttpErrorDetails,
} from "./http-exceptions";
import { AppError } from "@shared/errors/app-error";
import { BadRequestError } from "@shared/errors/bad-request.error";
import { ConflictError } from "@shared/errors/conflict.error";
import { ForbiddenError } from "@shared/errors/forbidden.error";
import { InternalServerError } from "@shared/errors/internal-server.error";
import { NotFoundError } from "@shared/errors/not-found.error";
import { UnauthorizedError } from "@shared/errors/unauthorized.error";

function isHttpException(err: unknown): err is HttpException {
  return err instanceof HttpException;
}

function isAppError(err: unknown): err is AppError {
  return err instanceof AppError;
}

function isError(err: unknown): err is Error {
  return typeof err === "object" && err !== null && "message" in err;
}

function mapAppErrorToHttpException(err: AppError): HttpException {
  const errDetails = err.details as HttpErrorDetails;

  if (err instanceof BadRequestError) {
    return new BadRequestException(
      err.message,
      err.details as HttpErrorDetails,
    );
  }
  if (err instanceof UnauthorizedError) {
    return new UnauthorizedException(err.message, errDetails);
  }
  if (err instanceof ForbiddenError) {
    return new ForbiddenException(err.message, errDetails);
  }
  if (err instanceof NotFoundError) {
    return new NotFoundException(err.message, errDetails);
  }
  if (err instanceof ConflictError) {
    return new ConflictException(err.message, errDetails);
  }
  if (err instanceof InternalServerError) {
    return new InternalServerErrorException(err.message, errDetails);
  }

  return new InternalServerErrorException("Unexpected error", {
    message: err.message,
    details: err.details,
  });
}

export function globalExceptionFilter(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  const normalized: HttpException = isHttpException(err)
    ? err
    : isAppError(err)
      ? mapAppErrorToHttpException(err)
      : new InternalServerErrorException(
          "Unexpected error",
          isError(err) ? { message: err.message } : undefined,
        );

  // Avoid double-send
  if (res.headersSent) return;

  res.status(normalized.statusCode).json({
    statusCode: normalized.statusCode,
    error: normalized.error,
    message: normalized.message,
    details: normalized.details,
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
}
