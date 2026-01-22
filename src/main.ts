import "reflect-metadata";
import "./http";

import chalk from "chalk";
import { registerControllers } from "@kernel/runtime/register-controllers";
import "./user/user.controller";
import { createApp } from "@adapters/http/app";

const app = createApp();
registerControllers(app);

app.listen(3000, () =>
  console.log(chalk.blue("Server is litening on port 3000")),
);
