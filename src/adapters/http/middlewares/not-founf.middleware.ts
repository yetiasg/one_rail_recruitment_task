import { NotFoundException } from "@kernel/http/http-exceptions";
import { NextFunction, Request, Response } from "express";

export function notFoundMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  next(
    new NotFoundException(`Route ${req.method} ${req.originalUrl} not found`),
  );
}
