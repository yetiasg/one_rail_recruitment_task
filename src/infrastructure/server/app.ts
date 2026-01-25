import express, { type Express } from "express";
import helmet from "helmet";
import cors from "cors";
import { buildCorsOptionsFromConfig } from "@infrastructure/server/cors";
import { cacheControlGetOnly } from "@adapters/http/middlewares/cache-control.middleware";
const TEN_MINUTES_SECONDS = 600;

export function createApp(): Express {
  const app = express();

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  app.disable("x-powered-by");

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  );

  app.use(cors(buildCorsOptionsFromConfig()));

  app.use(cacheControlGetOnly("/api/users", TEN_MINUTES_SECONDS));
  app.use(cacheControlGetOnly("/api/organizations", TEN_MINUTES_SECONDS));

  return app;
}
