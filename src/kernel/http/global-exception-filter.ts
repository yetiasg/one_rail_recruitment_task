import type { NextFunction, Request, Response } from "express";
import { HttpException, InternalServerErrorException } from "./http-exceptions";

function isHttpException(err: unknown): err is HttpException {
  return err instanceof HttpException;
}

function isError(err: unknown): err is Error {
  return typeof err === "object" && err !== null && "message" in err;
}

export function globalExceptionFilter(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  const normalized = isHttpException(err)
    ? err
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
