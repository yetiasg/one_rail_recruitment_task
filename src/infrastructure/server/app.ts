import express, { type Express } from "express";
import helmet from "helmet";
import cors from "cors";
import { buildCorsOptionsFromConfig } from "@infrastructure/server/cors";

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

  return app;
}
