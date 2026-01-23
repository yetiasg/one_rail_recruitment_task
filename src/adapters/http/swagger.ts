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
      servers: [{ url: "http://localhost:3000" }],
    },
    // 🔴 NAJWAŻNIEJSZE
    apis: [
      // jeśli uruchamiasz TS bez buildu
      "./src/**/*.ts",

      // jeśli uruchamiasz po buildzie
      "./dist/**/*.js",
    ],
  });

  console.log("Swagger paths:", Object.keys(spec.paths ?? {}));

  app.get("/swagger/openapi.json", (_req, res) => res.json(spec));
  app.use("/swagger", swaggerUi.serve, swaggerUi.setup(spec, {}));

  console.log(`Swagger docs awailable on http://localhost:3000/swagger`);
}
