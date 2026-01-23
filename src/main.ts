import "./adapters/http";
import "./infrastructure";

import "reflect-metadata";
import chalk from "chalk";

import { registerControllers } from "@kernel/runtime/register-controllers";
import { createApp } from "@adapters/http/app";
import { registerBindings } from "@infrastructure/providers";
import { globalExceptionFilter } from "@kernel/http/global-exception-filter";
import { mountSwagger } from "@adapters/http/swagger";

const app = createApp();

registerBindings();
registerControllers(app);
app.use(globalExceptionFilter);
mountSwagger(app);

app.listen(3000, () =>
  console.log(chalk.blue("Server is litening on port 3000")),
);
