import winston from "winston";
import { utilities as nestWinstonModuleUtilities } from "nest-winston";
import { AppEnv } from "@infrastructure/config/env.schema";
import { Config } from "@config/config";

export type Logger = winston.Logger;

let instance: Logger | null = null;

export function createLogger(): Logger {
  const NODE_ENV = Config.get<AppEnv, AppEnv["NODE_ENV"]>("NODE_ENV");
  const LOG_LEVEL = Config.get<AppEnv, AppEnv["LOG_LEVEL"]>("LOG_LEVEL");

  const onlyDebug = winston.format((info) =>
    info.level === "debug" ? info : false,
  );

  return winston.createLogger({
    level: LOG_LEVEL,
    transports: [
      new winston.transports.Console({
        level: "info",
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          nestWinstonModuleUtilities.format.nestLike("API", {
            colors: true,
            prettyPrint: true,
            processId: true,
            appName: true,
          }),
        ),
      }),

      new winston.transports.Console({
        level: "debug",
        silent: NODE_ENV === "production",
        format: winston.format.combine(
          onlyDebug(),
          winston.format.colorize({ level: true, colors: { debug: "yellow" } }),
          winston.format.timestamp(),
          winston.format.printf(({ timestamp, level, message, ...meta }) => {
            const metaStr = Object.keys(meta).length
              ? `\n${JSON.stringify(meta, null, 2)}`
              : "";

            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            return `${timestamp} [${level}]: ${message}${metaStr}`;
          }),
        ),
      }),
    ],
  });
}

function getLogger(): Logger {
  if (instance) return instance;
  instance = createLogger();
  return instance;
}

export const logger = new Proxy({} as Logger, {
  get(_target, prop: keyof Logger) {
    const instance = getLogger();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const value = instance[prop];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
