import { CachePort } from "src/core/cache/cache.port";
import { redisStore } from "../redis/redis";

export class RedisCacheAdapter implements CachePort {
  get<T>(key: string) {
    return redisStore.get<T>(key);
  }

  async set<T>(key: string, value: T, ttl?: number) {
    await redisStore.set(key, value, ttl ? ttl * 1000 : undefined);
  }

  async del(key: string) {
    await redisStore.delete(key);
  }
}
