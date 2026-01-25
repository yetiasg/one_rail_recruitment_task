import type { Request, Response, NextFunction } from "express";

export function cacheControlGetOnly(matchPath: string, timeInSeconds: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const requestPath = req.path ?? req.url;

    if (req.method === "GET" && requestPath.startsWith(matchPath)) {
      // Use "private" if responses may depend on auth/user-specific data
      res.setHeader("Cache-Control", `private, max-age=${timeInSeconds}`);
    }

    next();
  };
}
