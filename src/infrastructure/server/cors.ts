import type { CorsOptions } from "cors";
import { Config } from "@infrastructure/config/config";
import type { AppEnv } from "@infrastructure/config/env.schema";

export function buildCorsOptionsFromConfig(): CorsOptions {
  const originsRaw = Config.get<AppEnv, "CORS_ORIGINS">("CORS_ORIGINS");

  const allowedOrigins = originsRaw
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  return {
    origin: (origin, callback) => {
      // allow non-browser requests
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS: origin "${origin}" is not allowed`));
    },

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
    exposedHeaders: ["X-Request-Id"],
    maxAge: 600,
  };
}
