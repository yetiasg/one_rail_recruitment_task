import { Sequelize } from "sequelize";
import { logger } from "@infrastructure/logging/logger";
import { AppEnv } from "@infrastructure/config/env.schema";
import { Config } from "@config/config";

let instance: Sequelize | null = null;

export function createSequelize(): Sequelize {
  const DB_NAME = Config.get<AppEnv, AppEnv["DB_NAME"]>("DB_NAME");
  const DB_HOST = Config.get<AppEnv, AppEnv["DB_HOST"]>("DB_HOST");
  const DB_PORT = Config.get<AppEnv, AppEnv["DB_PORT"]>("DB_PORT");
  const DB_USER = Config.get<AppEnv, AppEnv["DB_USER"]>("DB_USER");
  const DB_PASSWORD = Config.get<AppEnv, AppEnv["DB_PASSWORD"]>("DB_PASSWORD");

  return new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: "mysql",
    logging(sql) {
      logger.info(sql);
    },
  });
}

function getSequelize(): Sequelize {
  if (instance) return instance;
  instance = createSequelize();
  return instance;
}

export const sequelize = new Proxy({} as Sequelize, {
  get(_target, prop: keyof Sequelize) {
    const instance = getSequelize();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const value = instance[prop];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
