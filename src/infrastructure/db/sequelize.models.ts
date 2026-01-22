import { UserModel } from "@modules/user/infrastructure/persistence/sequelize/models/user.model";
import { OrganizationModel } from "@modules/organization/infrastructure/sequelize/models/organization.model";
import { OrderModel } from "@modules/order/infrastructure/sequelize/models/order.model";

UserModel.hasMany(OrderModel, { foreignKey: "userId", as: "orders" });
OrganizationModel.hasMany(OrderModel, {
  foreignKey: "organizationId",
  as: "orders",
});
OrderModel.belongsTo(UserModel, { foreignKey: "userId", as: "user" });
OrderModel.belongsTo(OrganizationModel, {
  foreignKey: "organizationId",
  as: "organization",
});

OrganizationModel.hasMany(UserModel, {
  foreignKey: "organizationId",
  sourceKey: "id",
});
UserModel.belongsTo(OrganizationModel, {
  foreignKey: "organizationId",
  targetKey: "id",
});
