import { associateSequelizeModels } from "./db/associations";
import { createSequelize } from "./db/sequelize.instance";
import { registerSequelizeModels } from "./db/sequelize.register-modules";
import { createLogger } from "./logging/logger";
import { crateRedisStore } from "./redis/redis";

// eslint-disable-next-line @typescript-eslint/require-await
export async function initInfrastructure() {
  createLogger();
  crateRedisStore();

  const sequelize = createSequelize();
  registerSequelizeModels(sequelize);
  associateSequelizeModels();
}
