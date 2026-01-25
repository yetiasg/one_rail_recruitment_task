import type { Express } from "express";
import swaggerUi from "swagger-ui-express";
import { buildOpenApiDocument } from "./openapi";

export interface MountSwaggerParams {
  title: string;
  version: string;
  serverUrl?: string;
  jsonPath?: string;
  docsPath?: string;
}

export function mountSwagger(app: Express, params: MountSwaggerParams) {
  const jsonPath = params.jsonPath ?? "/swagger/openapi.json";
  const docsPath = params.docsPath ?? "/swagger";

  app.get(jsonPath, (_req, res) => {
    try {
      const doc = buildOpenApiDocument({
        title: params.title,
        version: params.version,
        serverUrl: params.serverUrl,
      });
      res.json(doc);
    } catch (e) {
      console.error("[OpenAPI] Failed to build document:", e);

      res.status(500).json({
        message: "Failed to build OpenAPI document",
        error: e instanceof Error ? e.message : String(e),
      });
    }
  });

  app.use(
    docsPath,
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
      swaggerOptions: {
        url: jsonPath,
      },
    }),
  );
}
