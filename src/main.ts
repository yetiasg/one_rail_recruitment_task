import "reflect-metadata";

import chalk from "chalk";
import { registerControllers } from "@kernel/runtime/register-controllers";
import { createApp } from "@infrastructure/server/app";
import { registerBindings } from "@infrastructure/bindings";
import { globalExceptionFilter } from "@kernel/http/global-exception-filter";
import { mountReadiness } from "@adapters/http/system/readiness";
import { mountHealth } from "@adapters/http/system/health";
import { httpHeadersLogger } from "@adapters/http/middlewares/http-headers-logger.middleware";
import { Config } from "./infrastructure/config/config";
import { AppEnv, schema } from "@infrastructure/config/env.schema";
import { registerHttpModules } from "@adapters/http/register-http-modules";
import { initInfrastructure } from "@infrastructure/init";
import { notFoundMiddleware } from "@adapters/http/middlewares/not-founf.middleware";
import { mountSwagger } from "@adapters/http/openapi/mount-swagger";
import { registerOpenApiModules } from "@adapters/http/openapi/register-openapi-modules";
import { lruInvalidateOnMutationsUniversal } from "@adapters/http/middlewares/lru-cache-invalidate.middleware";
import { lruGetResponseCacheAll } from "@adapters/http/middlewares/lru-response-cache.middleware";
import { cacheControlGetOnly } from "@adapters/http/middlewares/cache-control.middleware";

const TEN_MINUTES_SECONDS = 600;

async function bootstrap() {
  Config.register({ schema });

  await initInfrastructure();
  registerBindings();

  const app = createApp();

  app.use(httpHeadersLogger);

  // Caching
  app.use(cacheControlGetOnly("/api/users", TEN_MINUTES_SECONDS));
  app.use(cacheControlGetOnly("/api/organizations", TEN_MINUTES_SECONDS));
  app.use(lruInvalidateOnMutationsUniversal());
  app.use(lruGetResponseCacheAll());

  registerHttpModules();
  registerControllers(app, { globalPrefix: "api" });
  registerOpenApiModules();

  mountReadiness(app);
  mountHealth(app);
  mountSwagger(app, {
    title: "API Docs",
    version: "1.0.0",
    serverUrl: "http://localhost:3000",
    jsonPath: "/swagger/openapi.json",
    docsPath: "/swagger",
  });

  app.use(notFoundMiddleware);
  app.use(globalExceptionFilter);

  const PORT = Config.get<AppEnv, "PORT">("PORT");
  app.listen(PORT, () =>
    console.log(chalk.blue(`Server is litening on port ${PORT}`)),
  );
}
void bootstrap();
