import "reflect-metadata";

import "./adapters/http";
import "./infrastructure";

import chalk from "chalk";
import { registerControllers } from "@kernel/runtime/register-controllers";
import { createApp } from "@adapters/http/app";
import { registerBindings } from "@infrastructure/bindings";
import { globalExceptionFilter } from "@kernel/http/global-exception-filter";
import { mountSwagger } from "@adapters/http/swagger/swagger";
import { mountReadiness } from "@adapters/http/readiness/readiness";
import { sequelize } from "@infrastructure/db/sequelize.instance";
import { mountHealth } from "@adapters/http/health/health";

function bootstrap() {
  const app = createApp();

  registerBindings();
  registerControllers(app);

  app.use(globalExceptionFilter);

  mountReadiness(app, { sequelize });
  mountHealth(app);
  mountSwagger(app);

  app.listen(3000, () =>
    console.log(chalk.blue("Server is litening on port 3000")),
  );
}
void bootstrap();
