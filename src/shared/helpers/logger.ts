import winston from "winston";
import { utilities as nestWinstonModuleUtilities } from "nest-winston";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const onlyDebug = winston.format((info) =>
  info.level === "debug" ? info : false,
);

export const logger = winston.createLogger({
  level: "info",
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
      silent: process.env.NODE_ENV === "production",
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
