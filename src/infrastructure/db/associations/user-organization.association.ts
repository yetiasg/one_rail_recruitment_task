import { OrganizationModel } from "@modules/organization/adapters/sequelize/models/organization.model";
import { UserModel } from "@modules/user/adapters/persistence/sequelize/models/user.model";

export function registerUserOrganizationAssociation() {
  // User <-> Organization
  OrganizationModel.hasMany(UserModel, {
    foreignKey: "organizationId",
    sourceKey: "id",
    as: "users",
  });
  UserModel.belongsTo(OrganizationModel, {
    foreignKey: "organizationId",
    targetKey: "id",
    as: "organization",
  });
}
