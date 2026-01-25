import { OrderModel } from "@modules/order/adapters/sequelize/models/order.model";
import { UserModel } from "@modules/user/adapters/persistence/sequelize/models/user.model";

export function registerOrderUserAssociation() {
  // Order <-> User
  UserModel.hasMany(OrderModel, { foreignKey: "userId", as: "orders" });
  OrderModel.belongsTo(UserModel, { foreignKey: "userId", as: "user" });
}
