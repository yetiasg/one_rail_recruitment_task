import type { Request, Response, NextFunction } from "express";

const TEN_MINUTES_SECONDS = 600;

export function cacheControl10m(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const path = req.path ?? req.url;

  if (path.startsWith("/api/users") || path.startsWith("/api/organizations")) {
    res.setHeader("Cache-Control", `public, max-age=${TEN_MINUTES_SECONDS}`);
  }

  next();
}
