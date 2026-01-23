import type { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

export function mountSwagger(app: Express) {
  const spec = swaggerJSDoc({
    definition: {
      openapi: "3.0.3",
      info: {
        title: "API Docs",
        version: "1.0.0",
      },
    },
    apis: ["./src/**/*.ts", "./dist/**/*.js"],
  });

  app.get("/swagger/openapi.json", (_req, res) => res.json(spec));
  app.use("/swagger", swaggerUi.serve, swaggerUi.setup(spec, {}));
}
