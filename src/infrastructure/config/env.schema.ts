import Joi from "joi";

export type AppEnv = {
  NODE_ENV: "development" | "test" | "production";
  PORT: number;

  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;

  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_USER: string;
  REDIS_PASSWORD: string;

  CORS_ORIGINS: string;

  LOG_LEVEL: "error" | "warn" | "info" | "http" | "verbose" | "debug" | "silly";
};

export const schema = Joi.object<AppEnv>({
  NODE_ENV: Joi.string()
    .valid("development", "test", "production")
    .default("development"),
  PORT: Joi.number().integer().min(1).max(65535).default(3000),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().integer().min(1).max(65535).default(3306),
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),

  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().integer().min(1).max(65535).default(6379),
  REDIS_USER: Joi.string().required(),
  REDIS_PASSWORD: Joi.string().required(),

  CORS_ORIGINS: Joi.string().required(),

  LOG_LEVEL: Joi.string()
    .valid("error", "warn", "info", "http", "verbose", "debug", "silly")
    .default("info"),
}).unknown(true);
