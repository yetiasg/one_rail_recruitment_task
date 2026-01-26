/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from "@kernel/di/injectable.decorator";
import { LRUCache } from "lru-cache";
import { CachePort } from "src/core/cache/cache.port";

type CacheValue = object;

@Injectable()
export class LruCacheAdapter implements CachePort {
  private readonly cache: LRUCache<string, CacheValue>;

  constructor(options?: { max?: number; defaultTtlSeconds?: number }) {
    const max = options?.max ?? 10_000;
    const defaultTtlSeconds = options?.defaultTtlSeconds ?? 600;

    this.cache = new LRUCache<string, CacheValue>({
      max,
      ttl: defaultTtlSeconds * 1000,
      allowStale: false,
      updateAgeOnGet: true,
    });
  }

  async get<T>(key: string): Promise<T | undefined> {
    return this.cache.get(key) as T | undefined;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds && ttlSeconds > 0) {
      this.cache.set(key, value as CacheValue, { ttl: ttlSeconds * 1000 });
      return;
    }

    this.cache.set(key, value as CacheValue);
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
  }
}
