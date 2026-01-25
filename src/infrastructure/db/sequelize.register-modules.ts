import { OrderModel } from "@modules/order/adapters/sequelize/models/order.model";
import { OrganizationModel } from "@modules/organization/adapters/sequelize/models/organization.model";
import { UserModel } from "@modules/user/adapters/persistence/sequelize/models/user.model";
import { Sequelize } from "sequelize";

export function registerSequelizeModels(sequelize: Sequelize) {
  UserModel.register(sequelize);
  OrganizationModel.register(sequelize);
  OrderModel.register(sequelize);
}
