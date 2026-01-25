import { OrderModel } from "@modules/order/adapters/sequelize/models/order.model";
import { OrganizationModel } from "@modules/organization/adapters/sequelize/models/organization.model";

export function registerOrderOrganizationAssociation() {
  // Order <-> Organization
  OrganizationModel.hasMany(OrderModel, {
    foreignKey: "organizationId",
    as: "orders",
  });
  OrderModel.belongsTo(OrganizationModel, {
    foreignKey: "organizationId",
    as: "organization",
  });
}
