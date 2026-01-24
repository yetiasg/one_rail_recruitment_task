import { type Sequelize } from "sequelize";

interface ModelLoader {
  _load(sequelize: Sequelize): void;
}

export function initModels(sequelize: Sequelize, ...models: ModelLoader[]) {
  models.forEach((model) => model._load(sequelize));
}
