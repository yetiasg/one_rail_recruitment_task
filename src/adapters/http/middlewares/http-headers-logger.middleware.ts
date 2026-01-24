import { logger } from "@shared/helpers/logger";
import type { Request, Response, NextFunction } from "express";

function redactHeaders(headers: Record<string, unknown>) {
  const copy = { ...headers };
  if (copy.authorization) copy.authorization = "[REDACTED]";
  if (copy.cookie) copy.cookie = "[REDACTED]";
  return copy;
}

export function httpHeadersLogger(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  logger.debug("HTTP request headers", {
    method: req.method,
    url: req.originalUrl,
    headers: redactHeaders(req.headers as Record<string, unknown>),
  });

  next();
}
