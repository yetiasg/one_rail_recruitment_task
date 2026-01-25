import "reflect-metadata";

import chalk from "chalk";
import { registerControllers } from "@kernel/runtime/register-controllers";
import { createApp } from "@infrastructure/server/app";
import { registerBindings } from "@infrastructure/bindings";
import { globalExceptionFilter } from "@kernel/http/global-exception-filter";
import { mountSwagger } from "@adapters/http/system/swagger";
import { mountReadiness } from "@adapters/http/system/readiness";
import { mountHealth } from "@adapters/http/system/health";
import { httpHeadersLogger } from "@adapters/http/middlewares/http-headers-logger.middleware";
import { Config } from "./infrastructure/config/config";
import { AppEnv, schema } from "@infrastructure/config/env.schema";
import { registerHttpModules } from "@adapters/http/register-http-modules";
import { initInfrastructure } from "@infrastructure/init";
import cors from "cors";
import { notFoundMiddleware } from "@adapters/http/middlewares/not-founf.middleware";
import { buildCorsOptionsFromConfig } from "@infrastructure/server/cors";

async function bootstrap() {
  Config.register({ schema });

  await initInfrastructure();
  registerBindings();

  const app = createApp();

  app.use(cors(buildCorsOptionsFromConfig()));
  app.use(httpHeadersLogger);

  registerHttpModules();
  registerControllers(app, { globalPrefix: "api" });

  mountReadiness(app);
  mountHealth(app);
  mountSwagger(app);

  app.use(notFoundMiddleware);
  app.use(globalExceptionFilter);

  const PORT = Config.get<AppEnv, "PORT">("PORT");
  app.listen(PORT, () =>
    console.log(chalk.blue(`Server is litening on port ${PORT}`)),
  );
}
void bootstrap();
