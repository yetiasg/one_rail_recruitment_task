/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Request, Response, NextFunction } from "express";
import { LRUCache } from "lru-cache";

type CachedResponse = {
  status: number;
  headers: Record<string, string>;
  body: unknown;
  tags: string[];
};

const cache = new LRUCache<string, CachedResponse>({
  max: 10_000,
  ttl: 600 * 1000, // 10 minutes
  allowStale: false,
  updateAgeOnGet: true,
});

const tagIndex = new Map<string, Set<string>>();

function addToTagIndex(tag: string, key: string) {
  let set = tagIndex.get(tag);
  if (!set) {
    set = new Set<string>();
    tagIndex.set(tag, set);
  }
  set.add(key);
}

function removeFromTagIndex(key: string, tags: string[]) {
  for (const tag of tags) {
    const set = tagIndex.get(tag);
    if (!set) continue;

    set.delete(key);
    if (set.size === 0) tagIndex.delete(tag);
  }
}

function isIdLike(segment: string): boolean {
  // heuristic: numeric id or UUID-ish
  if (/^\d+$/.test(segment)) return true;
  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      segment,
    )
  )
    return true;
  return false;
}

function normalizePath(path: string): string {
  // remove query/hash if present (req.path normally has none, but keep safe)
  return path.split("?")[0].split("#")[0];
}

function splitSegments(path: string): string[] {
  return normalizePath(path)
    .split("/")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function computeTagsFromRequest(req: Request): string[] {
  const fullPath = normalizePath(req.originalUrl);
  const segments = splitSegments(fullPath);

  const tags: string[] = [];
  tags.push(`path:${fullPath}`);

  let acc = "";
  for (const seg of segments) {
    acc += `/${seg}`;
    tags.push(`seg:${acc}`);
  }

  const filtered = segments.filter(
    (s) => s.toLowerCase() !== "api" && !/^v\d+$/i.test(s),
  );

  if (filtered.length >= 1) {
    const resource = filtered[0];
    tags.push(`res:${resource}`);
    tags.push(`res:${resource}:list`);

    if (filtered.length >= 2 && isIdLike(filtered[1])) {
      tags.push(`res:${resource}:id:${filtered[1]}`);
    }
  }

  return Array.from(new Set(tags));
}

function buildCacheKey(req: Request): string {
  // method + full URL (includes query string)
  return `${req.method}:${req.originalUrl}`;
}

export function lruGetResponseCacheAll() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== "GET") return next();

    const key = buildCacheKey(req);
    const hit = cache.get(key);

    console.log({ key, hit });

    if (hit) {
      for (const [h, v] of Object.entries(hit.headers)) res.setHeader(h, v);
      return res.status(hit.status).json(hit.body);
    }

    const originalJson = res.json.bind(res);

    res.json = (body: unknown) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const headers: Record<string, string> = {};

        const contentType = res.getHeader("content-type");
        if (typeof contentType === "string")
          headers["content-type"] = contentType;

        const tags = computeTagsFromRequest(req);

        cache.set(key, { status: res.statusCode, headers, body, tags });
        for (const tag of tags) addToTagIndex(tag, key);
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return originalJson(body);
    };

    next();
  };
}
export function invalidateTag(tag: string): void {
  const set = tagIndex.get(tag);
  if (!set) return;

  const keys = Array.from(set);

  for (const key of keys) {
    const entry = cache.get(key);

    if (entry) removeFromTagIndex(key, entry.tags);
    else set.delete(key);

    cache.delete(key);
  }

  tagIndex.delete(tag);
}

export function invalidateTags(tags: string[]): void {
  for (const tag of tags) invalidateTag(tag);
}
