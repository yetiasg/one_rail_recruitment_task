/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Config } from "@config/config";
import { AppEnv } from "@infrastructure/config/env.schema";
import KeyvRedis from "@keyv/redis";
import { Keyv } from "keyv";

let instance: Keyv | null = null;

export function crateRedisStore() {
  const REDIS_HOST = Config.get<AppEnv, AppEnv["REDIS_HOST"]>("REDIS_HOST");
  const REDIS_PORT = Config.get<AppEnv, AppEnv["REDIS_PORT"]>("REDIS_PORT");
  const REDIS_USER = Config.get<AppEnv, AppEnv["REDIS_USER"]>("REDIS_USER");
  const REDIS_PASSWORD = Config.get<AppEnv, AppEnv["REDIS_PASSWORD"]>(
    "REDIS_PASSWORD",
  );
  const redisUrl = `redis://${REDIS_USER}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`;

  const keyvRedisStore = new KeyvRedis(redisUrl);
  instance = new Keyv({ store: keyvRedisStore });
  return instance;
}

function getRedisStore(): Keyv {
  if (instance) return instance;
  instance = crateRedisStore();
  return instance;
}

export const redisStore = new Proxy({} as Keyv<unknown>, {
  get(_target, prop: keyof Keyv) {
    const instance = getRedisStore();
    const value = instance[prop];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
