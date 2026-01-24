export abstract class CachePort {
  abstract get<T>(key: string): Promise<T | undefined>;
  abstract set<T>(key: string, value: T, ttlSeconds?: number): Promise<boolean>;
  abstract del(key: string): Promise<boolean>;
}
