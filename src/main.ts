import "reflect-metadata";
import "./adapters/http";

import chalk from "chalk";
import { registerControllers } from "@kernel/runtime/register-controllers";
import { createApp } from "@adapters/http/app";
import { registerBindings } from "@infrastructure/bindings";
import { globalExceptionFilter } from "@kernel/http/global-exception-filter";
import { mountSwagger } from "@adapters/http/swagger/swagger";
import { mountReadiness } from "@adapters/http/readiness/readiness";
import { mountHealth } from "@adapters/http/health/health";
import { httpHeadersLogger } from "@adapters/http/middlewares/http-headers-logger.middleware";
import { Config } from "./core/config/config";
import { AppEnv, schema } from "@infrastructure/config/env.schema";
import { createSequelize } from "@infrastructure/db/sequelize.instance";
import { createLogger } from "@infrastructure/logging/logger";
import { createModelsAssociations } from "@infrastructure/db/sequelize.models-associations";
import { OrderModel } from "@modules/order/infrastructure/sequelize/models/order.model";
import { UserModel } from "@modules/user/infrastructure/persistence/sequelize/models/user.model";
import { OrganizationModel } from "@modules/organization/infrastructure/sequelize/models/organization.model";
import { NotFoundException } from "@kernel/http/http-exceptions";
import { initModels } from "@infrastructure/db/sequelize.models-init";
import { crateRedisStore } from "@infrastructure/redis/redis";

function bootstrap() {
  Config.register({ schema });

  createLogger();
  const sequelize = createSequelize();

  crateRedisStore();

  initModels(sequelize, OrderModel, UserModel, OrganizationModel);
  createModelsAssociations();

  registerBindings();

  const app = createApp();
  app.use(httpHeadersLogger);
  registerControllers(app, { globalPrefix: "api" });

  mountReadiness(app);
  mountHealth(app);
  mountSwagger(app);

  app.use((req, _res, next) => {
    next(
      new NotFoundException(`Route ${req.method} ${req.originalUrl} not found`),
    );
  });

  app.use(globalExceptionFilter);

  const PORT = Config.get<AppEnv, "PORT">("PORT");

  app.listen(PORT, () =>
    console.log(chalk.blue(`Server is litening on port ${PORT}`)),
  );
}
void bootstrap();
