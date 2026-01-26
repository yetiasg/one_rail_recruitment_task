import type { Request, Response, NextFunction } from "express";
import {
  computeTagsFromRequest,
  invalidateTags,
} from "./lru-response-cache.middleware";

function isMutation(method: string) {
  return (
    method === "POST" ||
    method === "PUT" ||
    method === "PATCH" ||
    method === "DELETE"
  );
}

export function lruInvalidateOnMutationsUniversal() {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!isMutation(req.method)) return next();

    const tags = computeTagsFromRequest(req);

    const toInvalidate = tags.filter(
      (t) => t.startsWith("res:") || t.startsWith("seg:"),
    );

    invalidateTags(toInvalidate);

    next();
  };
}
