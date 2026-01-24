import { CachePort } from "src/core/cache/cache.port";
import { redisStore } from "./redis";

export class RedisCacheAdapter implements CachePort {
  get<T>(key: string) {
    return redisStore.get<T>(key);
  }

  set<T>(key: string, value: T, ttl?: number) {
    return redisStore.set(key, value, ttl ? ttl * 1000 : undefined);
  }

  del(key: string) {
    return redisStore.delete(key);
  }
}
